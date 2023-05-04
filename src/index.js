const fs = require('fs');
const mcs = require('node-mcstatus');
const path = require('path');
const { Client, IntentsBitField, EmbedBuilder } = require('discord.js');
const c = require('../config.js');
const { CommandHandler } = require('djs-commander');
const data = JSON.parse(fs.readFileSync('data.json'));
const chalk = require('chalk');

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});

const errors = [];

if (c.bot.token.startsWith('your-bot-token-here'))
  errors.push('Bot Token is Invalid.');
if (c.mcserver.ip === '')
  errors.push("The Minecraft server's IP address has not been specified.");
if (c.mcserver.type !== 'java' && c.mcserver.type !== 'bedrock')
  errors.push('Invalid Minecraft server type. Should be "java" or "bedrock".');

if (c.mcserver.name === '')
  errors.push("The Minecraft server's name has not been specified.");
if (c.mcserver.icon === '')
  errors.push("The Minecraft server's icon has not been specified.");

if (errors.length > 0) {
  console.error(chalk.red('Config file has the following errors:'));
  errors.forEach((item) => console.log(chalk.keyword('orange')(item)));
  process.exit(1);
}
new CommandHandler({
  client,
  eventsPath: path.join(__dirname, 'events'),
});
const offlineStatus = new EmbedBuilder()
  .setColor('DarkRed')
  .setTitle(':red_circle: OFFLINE')
  .setAuthor({ name: c.mcserver.name, iconURL: c.mcserver.icon })
  .setTimestamp()
  .setFooter({ text: 'Updated at' });

async function statusEdit(statusEmbed, status) {
  try {
    const channel = await client.channels.fetch(data.channelId);
    const message = await channel.messages.fetch(data.messageId);
    await message.edit({ content: '', embeds: [statusEmbed] });
    console.log(`The status is updated to ${status}`);
  } catch (error) {
    console.error(error);
  }
}

function statusRetrival() {
  if (c.mcserver.type === 'bedrock') {
    mcs
      .statusBedrock(c.mcserver.ip, c.mcserver.port)
      .then((data) => {
        const onlineEmbedBedrock = new EmbedBuilder()
          .setColor('Green')
          .setTitle(':green_circle: ONLINE')
          .setAuthor({ name: c.mcserver.name, iconURL: c.mcserver.icon })
          .addFields(
            {
              name: '__**PLAYERS**__',
              value: `**${data.players.online}**/**${data.players.max}**\n`,
            },
            {
              name: '__**MOTD**__',
              value: `**${data.motd.clean}**`,
            },
            {
              name: '__**IP ADDRESS**__',
              value: `**${data.host}:${data.port}**`,
            },
            {
              name: '__**INFO**__',
              value: `**Version: ${data.version.name}\nGameMode: ${data.gamemode}\n Edition: ${data.edition}**`,
            }
          )
          .setTimestamp()
          .setFooter({ text: 'Updated at' });
        statusEdit(onlineEmbedBedrock, chalk.green`✔ Online`);
      })
      .catch((error) => {
        console.log(error);
      });
  } else {
    mcs
      .statusJava(c.mcserver.ip, c.mcserver.port)
      .then((data) => {
        module.exports = {
          data,
        };
        if (data.online === true && data.players.max > 0) {
          const playerList = data.players.list.reduce((acc, item) => {
            return acc + item.name_clean + '\n';
          }, '');
          const onlineStatus = new EmbedBuilder()
            .setColor('DarkGreen')
            .setTitle(':green_circle: ONLINE')
            .setAuthor({
              name: c.mcserver.name,
              iconURL: c.mcserver.icon,
            })
            .addFields(
              {
                name: '__**PLAYERS**__',
                value:
                  `**${data.players.online}**/**${data.players.max}**\n` +
                  `\`\`\`${playerList}\`\`\``,
              },
              {
                name: '__**MOTD**__',
                value: `**${data.motd.clean}**`,
              },
              {
                name: '__**IP ADDRESS**__',
                value: `**${data.host}:${data.port}**`,
              },
              {
                name: '__**VERSION**__',
                value: `**${data.version.name_clean}**`,
              }
            )
            .setTimestamp()
            .setFooter({
              text: 'Updated at',
            });
          statusEdit(onlineStatus, chalk.green`✔ Online`);
        } else {
          statusEdit(offlineStatus, chalk.red`❌Offline`);
        }
      })
      .catch((error) => {
        statusEdit(offlineStatus, chalk.red`❌Offline`);
        console.error(error);
      });
  }
}

module.exports = {
  statusEdit,
  statusRetrival,
};

client.login(c.bot.token);

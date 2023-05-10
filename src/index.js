const fs = require('fs');
const { statusBedrock, statusJava } = require('node-mcstatus');
const path = require('path');
const {
  Client,
  IntentsBitField,
  EmbedBuilder,
  ActivityType,
} = require('discord.js');
const config = require('../config.js');
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

console.log(
  chalk.red('Checking for Errors in the config.js file. Please Wait.')
);

if (config.bot.token.startsWith('your-bot-token-here'))
  errors.push('Bot Token is Invalid.');

if (!config.mcserver.ip)
  errors.push("The Minecraft server's IP address has not been specified.");

if (!['java', 'bedrock'].includes(config.mcserver.type))
  errors.push('Invalid Minecraft server type. Should be "java" or "bedrock".');

if (!config.mcserver.name)
  errors.push("The Minecraft server's name has not been specified.");

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
  .setAuthor({
    name: config.mcserver.name,
    iconURL: `https://api.mcstatus.io/v2/icon/${config.mcserver.ip}:${config.mcserver.port}`,
  })
  .setTimestamp()
  .setFooter({ text: 'Updated at' });

async function statusEdit(statusEmbed, status) {
  try {
    const channel = await client.channels.fetch(data.channelId);
    const message = await channel.messages.fetch(data.messageId);
    await message.edit({ content: '', embeds: [statusEmbed] });
    console.log(`The status is updated to ${status}`);
  } catch (error) {
    console.error(`Error with editing status message ${error.message}`);
  }
}

function presenceText(data) {
  let offlineText = config.bot.presence.text.online;
  offlineText = offlineText.replace(
    /{playeronline}/g,
    `${data.players.online}`
  );
  offlineText = offlineText.replace(/{playermax}/g, `${data.players.max}`);

  return offlineText;
}

function statusRetrival() {
  if (config.mcserver.type === 'bedrock') {
    statusBedrock(config.mcserver.ip, config.mcserver.port)
      .then((data) => {
        if (data.online === true && data.players.max > 0) {
          const onlineEmbedBedrock = new EmbedBuilder()
            .setColor('Green')
            .setTitle(':green_circle: ONLINE')
            .setAuthor({
              name: config.mcserver.name,
              iconURL: `https://api.mcstatus.io/v2/icon/${config.mcserver.ip}:${config.mcserver.port}`,
            })
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
                name: '__**SERVER ADDRESS**__',
                value: `**IP: \`${data.host}\`\nPort: \`${data.port}\`**`,
              },
              {
                name: '__**INFO**__',
                value: `**Version: ${data.version.name}\nGameMode: ${data.gamemode}\n Edition: ${data.edition}**`,
              }
            )
            .setTimestamp()
            .setFooter({ text: `Updated at` });

          statusEdit(
            onlineEmbedBedrock,
            `${chalk.green('✔ Online')} with ${chalk.green(
              data.players.online
            )} Players Playing.`
          );
          const statusText = presenceText(data);
          client.user.setStatus(config.bot.presence.status.online);
          client.user.setActivity(statusText, {
            type: ActivityType[config.bot.presence.activity],
          });
          console.log(
            `Status set to: ${chalk.green(
              `${config.bot.presence.activity} ${statusText}`
            )}`
          );
        } else {
          statusEdit(offlineStatus, chalk.red`❌ Offline`);
          client.user.setActivity(config.bot.presence.text.offline, {
            type: ActivityType[config.bot.presence.activity],
          });
          client.user.setStatus(config.bot.presence.status.offline);
          console.log(
            `Status set to: ${chalk.green(
              `${config.bot.presence.activity} ${config.bot.presence.text.offline}`
            )}`
          );
        }
      })
      .catch((error) => {
        statusEdit(
          offlineStatus,
          chalk.red`Setting Offline due to a problem with mcstatus.io API service or your Network.`
        );
        console.log(
          `A Error with Bedrock auto-changing status: \n ${chalk.keyword(
            'orange'
          )(error)}`
        );
        client.user.setStatus(config.bot.presence.status.offline);
        client.user.setActivity(config.bot.presence.text.offline, {
          type: ActivityType[config.bot.presence.activity],
        });
        console.log(
          `Status set to: ${chalk.green(
            `${config.bot.presence.activity} ${config.bot.presence.text.offline}`
          )}`
        );
      });
  } else {
    statusJava(config.mcserver.ip, config.mcserver.port)
      .then((data) => {
        module.exports = {
          data,
        };
        if (data.online === true && data.players.max > 0) {
          const playerList = data.players.list.reduce((acc, item) => {
            return `${acc}• ${item.name_clean} \n`;
          }, '');
          const onlineStatus = new EmbedBuilder()
            .setColor('DarkGreen')
            .setTitle(':green_circle: ONLINE')
            .setAuthor({
              name: config.mcserver.name,
              iconURL: `https://api.mcstatus.io/v2/icon/${config.mcserver.ip}:${config.mcserver.port}`,
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
            .setFooter({ text: `Updated at` });

          statusEdit(
            onlineStatus,
            `${chalk.green('✔ Online')} with ${chalk.green(
              data.players.online
            )} Players Playing.`
          );
          const statusText = presenceText(data);
          client.user.setActivity(statusText, {
            type: ActivityType[config.bot.presence.activity],
          });
          client.user.setStatus(config.bot.presence.status.online);
          console.log(
            `Status set to: ${chalk.green(
              `${config.bot.presence.activity} ${statusText}`
            )}`
          );
        } else {
          statusEdit(offlineStatus, chalk.red`❌Offline`);
          client.user.setActivity(config.bot.presence.text.offline, {
            type: ActivityType[config.bot.presence.activity],
          });
          client.user.setStatus(config.bot.presence.status.offline);
          console.log(
            `Status set to: ${config.bot.presence.activity} ${config.bot.presence.text.offline}`
          );
        }
      })
      .catch((error) => {
        statusEdit(
          offlineStatus,
          chalk.red`Setting due to a problem with mcstatus.io API service or your Network.`
        );
        console.log(
          s`A Error with Java auto-changing status : \n ${chalk.keyword(
            'orange'
          )(error)}`
        );
        client.user.setStatus(config.bot.presence.status.offline);
        client.user.setActivity(config.bot.presence.text.offline, {
          type: ActivityType[config.bot.presence.activity],
        });
        console.log(
          `Status set to: ${chalk.green(
            `${config.bot.presence.activity} ${config.bot.presence.text.offline}`
          )}`
        );
      });
  }
}

module.exports = {
  statusEdit,
  statusRetrival,
};

client.login(config.bot.token);

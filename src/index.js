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
const data = require('../data.json');
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
function checkError(condition, errorMessage) {
  if (condition) errors.push(errorMessage);
}
checkError(
  config.bot.token.startsWith('your-bot-token-here'),
  'Bot Token is Invalid.'
);
checkError(
  !['online', 'idle', 'dnd', 'invisible'].includes(
    config.bot.presence.status.online && config.bot.presence.status.offline
  ),
  "Invalid bot status options. Should be 'online', 'idle', 'dnd' or 'invisible'."
);
checkError(
  !['Playing', 'Listening', 'Watching', 'Competing'].includes(
    config.bot.presence.activity
  ),
  "Invalid bot activity options. Should be 'Playing', 'Listening','Watching' or 'Competing'"
);
checkError(
  !config.mcserver.ip,
  "The Minecraft server's IP address has not been specified."
);
checkError(
  !['java', 'bedrock'].includes(config.mcserver.type),
  'Invalid Minecraft server type. Should be "java" or "bedrock".'
);
checkError(
  !config.mcserver.name,
  "The Minecraft server's name has not been specified."
);
checkError(
  !config.mcserver.version,
  "The Minecraft server's version has not been specified."
);
if (errors.length > 0) {
  console.error(chalk.red('Config file has the following errors:'));
  errors.forEach((item) => console.log(chalk.keyword('orange')(item)));
  process.exit(1);
}

new CommandHandler({
  client,
  eventsPath: path.join(__dirname, 'events'),
  commandsPath: path.join(__dirname, 'commands'),
});

const icon = `https://api.mcstatus.io/v2/icon/${config.mcserver.ip}:${config.mcserver.port}`;

const offlineStatus = new EmbedBuilder()
  .setColor('Red')
  .setTitle(':red_circle: OFFLINE')
  .setAuthor({
    name: config.mcserver.name,
    iconURL: icon,
  })
  .setTimestamp()
  .setFooter({ text: 'Updated at' });

async function statusEdit(statusEmbed, status) {
  try {
    const channel = await client.channels.fetch(data.channelId);
    const message = await channel.messages.fetch(data.messageId);
    await message.edit({ content: '', embeds: [statusEmbed] });
    if (config.settings.logging.statusMessageUpdate === false) return;
    console.log(`The status is updated to ${status}`);
  } catch (error) {
    if (config.settings.logging.errorLog === false) return;
    console.error(
      chalk.red(`Error with editing status message:`),
      chalk.keyword('orange')(error.message)
    );
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

function offlineUpdate() {
  client.user.setStatus(config.bot.presence.status.offline);
  client.user.setActivity(config.bot.presence.text.offline, {
    type: ActivityType[config.bot.presence.activity],
  });
  statusEdit(offlineStatus, chalk.red`❌ Offline`);
  if (config.settings.logging.activityUpdate === false) return;
  console.log(
    `Status set to: ${chalk.green(
      `${config.bot.presence.activity} ${config.bot.presence.text.offline}`
    )}`
  );
}

function onlineUpdate(embed, data) {
  statusEdit(
    embed,
    `${chalk.green('✔ Online')} with ${chalk.green(
      data.players.online
    )} Players Playing.`
  );
  const statusText = presenceText(data);
  client.user.setActivity(statusText, {
    type: ActivityType[config.bot.presence.activity],
  });
  client.user.setStatus(config.bot.presence.status.online);
  if (config.settings.logging.activityUpdate === false) return;
  console.log(
    `Status set to: ${chalk.green(
      `${config.bot.presence.activity} ${statusText}`
    )}`
  );
}

function JavaEmbedCreate(data) {
  playerList = data.players.list.reduce((acc, item) => {
    return `${acc}• ${item.name_clean} \n`;
  }, '');
  const Embed = new EmbedBuilder()
    .setColor('Green')
    .setTitle(':green_circle: ONLINE')
    .setAuthor({
      name: config.mcserver.name,
      iconURL: icon,
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
        value: `**${config.mcserver.ip}:${config.mcserver.port}**`,
      },
      {
        name: '__**VERSION**__',
        value: `**${config.mcserver.version}**`,
      }
    )
    .setTimestamp()
    .setFooter({ text: `Updated at ` });
  return { Embed, playerList };
}

function BedrockEmbedCreate(data) {
  const onlineEmbedBedrock = new EmbedBuilder()
    .setColor('Green')
    .setTitle(':green_circle: ONLINE')
    .setAuthor({
      name: config.mcserver.name,
      iconURL: icon,
    })
    .addFields(
      {
        name: '__**PLAYERS**__',
        value: `**${data.players.online}**/**${data.players.max}**`,
      },
      {
        name: '__**MOTD**__',
        value: `**${data.motd.clean}**`,
      },
      {
        name: '__**SERVER ADDRESS**__',
        value: `**IP: \`${config.mcserver.ip}\`\nPort: \`${config.mcserver.port}\`**`,
      },
      {
        name: '__**INFO**__',
        value: `**Version: ${config.mcserver.version}`,
      }
    )
    .setTimestamp()
    .setFooter({ text: `Updated at ` });
  return onlineEmbedBedrock;
}

async function statusRetrieval() {
  if (config.mcserver.type === 'bedrock') {
    statusBedrock(config.mcserver.ip, config.mcserver.port)
      .then((data) => {
        if (data.online === true && data.players.max > 0) {
          const onlineBedrock = BedrockEmbedCreate(data);
          onlineUpdate(onlineBedrock, data);
          module.exports = {
            data,
          };
        } else {
          offlineUpdate();
        }
      })
      .catch((error) => {
        offlineUpdate();
        if (config.settings.logging.errorLog === false) return;
        console.log(
          `Setting status Offline due a Error with Bedrock auto-changing status: \n ${chalk.keyword(
            'orange'
          )(error)}`
        );
      });
  } else {
    statusJava(config.mcserver.ip, config.mcserver.port)
      .then((data) => {
        if (data.online === true && data.players.max > 0) {
          const onlineJava = JavaEmbedCreate(data);
          onlineUpdate(onlineJava.Embed, data);
          module.exports = {
            data,
          };
        } else {
          offlineUpdate();
        }
      })
      .catch((error) => {
        offlineUpdate();
        if (config.settings.logging.errorLog === false) return;
        console.log(
          `Setting status Offline due a Error with Java auto-changing status : \n ${chalk.keyword(
            'orange'
          )(error)}`
        );
      });
  }
}

module.exports = { statusRetrieval };

client.login(config.bot.token);

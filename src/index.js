const { Client, IntentsBitField, ActivityType } = require('discord.js');
const { statusBedrock, statusJava } = require('node-mcstatus');
const { OnlineEmbed, offlineStatus } = require('./embeds');
const { CommandHandler } = require('djs-commander');
const path = require('path');
const config = require('../config');
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

const getServerData = async () => {
  if (config.mcserver.type === 'java') {
    try {
      const data = await statusJava(config.mcserver.ip, config.mcserver.port);

      playerNameClean = data.players.list.reduce((acc, item) => {
        return `${acc}• ${item.name_clean}\n`;
      }, '');
      const playerList = data.players.list.length
        ? `\`\`\`${playerNameClean}\`\`\``
        : ``;
      return { data, playerList };
    } catch (error) {
      if (!config.settings.logging.errorLog) return;
      console.error(
        chalk.red(`Error with retrieving java data:`),
        chalk.keyword('orange')(error.message)
      );
    }
  } else {
    try {
      const data = await statusBedrock(
        config.mcserver.ip,
        config.mcserver.port
      );
      const playerList = ``;
      return { data, playerList };
    } catch (error) {
      if (!config.settings.logging.errorLog) return;
      console.error(
        chalk.red(`Error with retrieving bedrock data:`),
        chalk.keyword('orange')(error.message)
      );
    }
  }
};

const statusUpdate = async () => {
  try {
    const { data, playerList } = await getServerData();
    if (data.online && data.players.max > 0) {
      const onlineEmbed = await OnlineEmbed(data, playerList);
      onlineUpdate(onlineEmbed, data);
    } else {
      offlineUpdate();
    }
  } catch (error) {
    offlineUpdate();
    if (!config.settings.logging.errorLog) return;
    console.error(
      chalk.red(`Setting status due to an error with updating status message:`),
      chalk.keyword('orange')(error.message)
    );
  }
};

async function statusEdit(statusEmbed, status) {
  try {
    const fs = require('fs');
    const data = JSON.parse(fs.readFileSync('data.json', 'utf8'));
    const channel = await client.channels.fetch(data.channelId);
    const message = await channel.messages.fetch(data.messageId);
    await message.edit({ content: '', embeds: [statusEmbed] });
    if (!config.settings.logging.statusMessageUpdate) return;
    console.log(`The status is updated to ${status}`);
  } catch (error) {
    if (!config.settings.logging.errorLog) return;
    console.error(
      chalk.red(`Error with editing status message:`),
      chalk.keyword('orange')(error.message)
    );
  }
}

function offlineUpdate() {
  client.user.setStatus(config.bot.presence.status.offline);
  client.user.setActivity(config.bot.presence.text.offline, {
    type: ActivityType[config.bot.presence.activity],
  });
  statusEdit(offlineStatus, chalk.red`❌ Offline`);
  if (!config.settings.logging.activityUpdate) return;
  console.log(
    `Status set to: ${chalk.green(
      `${config.bot.presence.activity} ${config.bot.presence.text.offline}`
    )}`
  );
}

function onlineUpdate(embed, data) {
  try {
    statusEdit(
      embed,
      `${chalk.green('✔ Online')} with ${chalk.green(
        data.players.online
      )} Players Playing.`
    );
    let statusText = config.bot.presence.text.online;
    statusText = statusText.replace(
      /{playeronline}/g,
      `${data.players.online}`
    );
    statusText = statusText.replace(/{playermax}/g, `${data.players.max}`);
    client.user.setActivity(statusText, {
      type: ActivityType[config.bot.presence.activity],
    });
    client.user.setStatus(config.bot.presence.status.online);
    if (!config.settings.logging.activityUpdate) return;
    console.log(
      `Status set to: ${chalk.green(
        `${config.bot.presence.activity} ${statusText}`
      )}`
    );
  } catch (error) {
    if (!config.settings.logging.errorLog) return;
    console.error(
      chalk.red(`Error with online status update: `),
      chalk.keyword('orange')(error.message)
    );
  }
}

module.exports = {
  statusUpdate,
  getServerData,
};

new CommandHandler({
  client,
  eventsPath: path.join(__dirname, 'events'),
  commandsPath: path.join(__dirname, 'commands'),
});

client.login(config.bot.token);

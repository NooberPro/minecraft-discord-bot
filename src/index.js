const { Client, IntentsBitField } = require('discord.js');
const { statusBedrock, statusJava } = require('node-mcstatus');
const { OnlineEmbed, offlineStatus } = require('./embeds');
const { CommandHandler } = require('djs-commander');
const path = require('path');
const config = require('../config');
const chalk = require('chalk');
const fs = require('fs');
const process = require('node:process');

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
    IntentsBitField.Flags.GuildEmojisAndStickers,
  ],
});

process.on('uncaughtException', (error) => {
  console.log(
    `${getDateNow()} | ${chalk.redBright('ERROR')} | ${chalk.bold(
      'Uncaught Exception'
    )}:`,
    error
  );
});

process.on('unhandledRejection', (reason) => {
  console.log(
    `${getDateNow()} | ${chalk.redBright('ERROR')} | ${chalk.bold(
      'Unhandled Rejection'
    )}:`,
    reason
  );
});

// Runs the checkError Function immediately.
(() => {
  const errors = [];

  console.log(
    chalk.blue('Checking for Errors in the config.js file. Please Wait.')
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

  checkError(
    config.playerCountCH.enabled &&
      config.playerCountCH.guildID === 'your-guild-id-here',
    'The Server/Guild ID has not been specified or Invaild.'
  );

  if (errors.length > 0) {
    console.error(chalk.red('Config file has the following errors:'));
    errors.forEach((errors) => console.log(chalk.keyword('orange')(errors)));
    process.exit(1);
  }
})();

const groupPlayerList = (playerListArrayRaw) => {
  let playerListArray = [
    {
      name: config.commands.players.embed.title,
      value: config.commands.players.embed.description
        .replace(/\{playeronline\}/gi, playerListArrayRaw.online)
        .replace(/\{playermax\}/gi, playerListArrayRaw.max),
    },
  ];
  const groups = [[], [], []];
  playerListArrayRaw.list.forEach((person, index) => {
    groups[index % 3].push(person.name_clean ?? person);
  });
  for (let i = 0; i < 3; i++) {
    if (groups[i][0] === undefined) continue;
    if (groups[i][1] === undefined) {
      playerListArray.push({
        name: ` • ${groups[i][0]}`,
        value: '‎ ',
        inline: true,
      });
    } else {
      playerListArray.push({
        name: `• ${groups[i][0]}`,
        value: `**• ${groups[i].slice(1).join('\n• ')}**`,
        inline: true,
      });
    }
  }
  return playerListArray;
};

const getError = (error, errorOrign) => {
  const errorLog = `${getDateNow()} | ${chalk.red('ERROR')} | ${chalk.bold(
    errorOrign
  )}: ${chalk.keyword('orange')(error.message)}`;
  return errorLog;
};

const getDateNow = () => {
  const formattedDateTime = new Date().toLocaleString('en-US', {
    hour12: true,
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    dateStyle: 'short',
    timeStyle: 'short',
  });
  return formattedDateTime;
};

const getPlayersList = async (playerListRaw) => {
  try {
    let playerListArray = [
      {
        name: config.commands.players.embed.title,
        value: config.commands.players.embed.description
          .replace(/\{playeronline\}/gi, playerListRaw.online)
          .replace(/\{playermax\}/gi, playerListRaw.max),
      },
    ];
    if (!playerListRaw.list?.length || config.mcserver.type === 'bedrock') {
      return playerListArray;
    } else {
      playerListArray = groupPlayerList(playerListRaw);
      return playerListArray;
    }
  } catch (error) {
    if (config.settings.logging.error) {
      console.log(getError(error, 'Player List Creation'));
    }
  }
};

const getServerDataAndPlayerList = async () => {
  try {
    const data =
      config.mcserver.type === 'java'
        ? await statusJava(config.mcserver.ip, config.mcserver.port)
        : await statusBedrock(config.mcserver.ip, config.mcserver.port);
    const isOnline = config.autoChangeStatus.isOnlineCheck
      ? data.online && data.players.max > 0
      : data.online;
    if (isOnline) {
      const playerListArray = await getPlayersList(data.players);
      return { data, playerListArray, isOnline };
    } else {
      let playerListArray = [];
      return { data, playerListArray, isOnline };
    }
  } catch (error) {
    if (config.settings.logging.error) {
      console.log(getError(error, 'Retrieving Mc Server data and PlayerList'));
    }
  }
};

const getServerDataOnly = async () => {
  try {
    const data =
      config.mcserver.type === 'java'
        ? await statusJava(config.mcserver.ip, config.mcserver.port)
        : await statusBedrock(config.mcserver.ip, config.mcserver.port);
    const isOnline = config.autoChangeStatus.isOnlineCheck
      ? data.online && data.players.max > 0
      : data.online;
    return { data, isOnline };
  } catch (error) {
    if (config.settings.logging.error) {
      console.log(getError(error, 'Retrieving Mc Server data'));
    }
  }
};

const statusMessageEdit = async () => {
  try {
    const dataPath = path.join(__dirname, 'data.json');
    let dataRead = fs.readFileSync(dataPath, 'utf8');
    dataRead = await JSON.parse(dataRead);
    const channel = await client.channels.fetch(dataRead.channelId);
    const message = await channel.messages.fetch(dataRead.messageId);
    const { data, playerListArray, isOnline } =
      await getServerDataAndPlayerList();
    if (isOnline) {
      await message.edit({
        content: '',
        embeds: [await OnlineEmbed(data, playerListArray)],
      });
      if (config.settings.logging.debug) {
        console.log(
          getDebug(
            'Status Message is updated to ',
            chalk.green(
              `${chalk.green('✔ Online')} with ${chalk.green(
                data.players.online
              )} Players Playing.`
            )
          )
        );
      }
    } else {
      await message.edit({
        content: '',
        embeds: [offlineStatus()],
      });
      if (config.settings.logging.debug) {
        console.log(
          getDebug('Status Message is updated to ', chalk.green(`❌ Offline`))
        );
      }
    }
  } catch (error) {
    if (config.settings.logging.error) {
      console.log(getError(error, 'Status Message Editing'));
    }
  }
};

const getDebug = (messageText, debugMessage) => {
  const debugOutput = `${chalk.gray(getDateNow())} | ${chalk.yellow(
    'DEBUG'
  )} | ${chalk.bold(messageText)} ${debugMessage}`;
  return debugOutput;
};

module.exports = {
  getServerDataAndPlayerList,
  getError,
  getDateNow,
  getServerDataOnly,
  getDebug,
  statusMessageEdit,
};

new CommandHandler({
  client,
  eventsPath: path.join(__dirname, 'events'),
  commandsPath: path.join(__dirname, 'commands'),
});

client.login(config.bot.token).catch((error) => {
  if (config.settings.logging.error) {
    console.log(getError(error, 'Error with Bot Login'));
  }
});

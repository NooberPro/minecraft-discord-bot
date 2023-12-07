const { Client, IntentsBitField } = require('discord.js')
const { statusBedrock, statusJava } = require('node-mcstatus')
const config = require('../config')
const chalk = require('chalk')
const fs = require('fs')
const { CommandKit } = require('commandkit')
const process = require('node:process')
const json5 = require('json5')

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
    IntentsBitField.Flags.GuildEmojisAndStickers,
  ],
})

const getDateNow = () => {
  return new Date().toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    timeZone: !config.settings.logging.timezone
      ? Intl.DateTimeFormat().resolvedOptions().timezone
      : config.settings.logging.timezone,
    timeZoneName: 'shortGeneric',
  })
}

process.on('uncaughtException', (error) => {
  console.log(`${getDateNow()} | ${chalk.redBright('ERROR')} | ${chalk.bold('Uncaught Exception')}:`, error)
})

process.on('unhandledRejection', (reason) => {
  console.log(`${getDateNow()} | ${chalk.redBright('ERROR')} | ${chalk.bold('Unhandled Rejection')}:`, reason)
})

const languageEmbedOuput = config.settings.language.embeds
  ? config.settings.language.embeds
  : config.settings.language.main
const embedFileContent = fs.readFileSync(`./translation/${languageEmbedOuput}/embeds.json5`, 'utf8')
const embedTranslation = json5.parse(embedFileContent)

const languageConsoleOuput = config.settings.language.consoleLog
  ? config.settings.language.consoleLog
  : config.settings.language.main
const consoleLogFileContent = fs.readFileSync(`./translation/${languageConsoleOuput}/console-log.json5`, 'utf8')
const consoleLogTranslation = json5.parse(consoleLogFileContent)

const cmdSlashLanguageOutput = config.settings.language.slashCmds
  ? config.settings.language.slashCmds
  : config.settings.language.main
const cmdSlashContents = fs.readFileSync(`./translation/${cmdSlashLanguageOutput}/slash-cmds.json5`, 'utf8')
const cmdSlashTranslation = json5.parse(cmdSlashContents)

// Runs the checkError Function immediately.
;(() => {
  function isTimeZoneSupported() {
    if (!config.settings.logging.timezone) return true
    try {
      Intl.DateTimeFormat(undefined, { timeZone: config.settings.logging.timezone })
      return true
    } catch (e) {
      return false
    }
  }

  const errors = []

  console.log(chalk.blue(consoleLogTranslation.checkErrorConfig.checkConfigWait))

  function checkError(condition, errorMessage) {
    if (condition) errors.push(errorMessage)
  }

  checkError(!isTimeZoneSupported(), consoleLogTranslation.checkErrorConfig.timezone)
  checkError(config.bot.token.startsWith('your-bot-token-here'), consoleLogTranslation.checkErrorConfig.botToken)
  checkError(
    !['online', 'idle', 'dnd', 'invisible'].includes(
      config.bot.presence.status.online && config.bot.presence.status.offline
    ),
    consoleLogTranslation.checkErrorConfig.botPresenceStatus
  )
  checkError(
    !['Playing', 'Listening', 'Watching', 'Competing'].includes(config.bot.presence.activity),
    consoleLogTranslation.checkErrorConfig.botStatusActivity
  )

  checkError(!['java', 'bedrock'].includes(config.mcserver.type), consoleLogTranslation.checkErrorConfig.mcType)
  checkError(!config.mcserver.name, consoleLogTranslation.checkErrorConfig.mcName)
  checkError(!config.mcserver.version, consoleLogTranslation.checkErrorConfig.mcVersion)

  checkError(
    config.playerCountCH.enabled && config.playerCountCH.guildID === 'your-guild-id-here',
    consoleLogTranslation.checkErrorConfig.guildID
  )

  if (errors.length > 0) {
    console.error(chalk.red(consoleLogTranslation.checkErrorConfig.followingErrors))
    errors.forEach((errors) => console.log(chalk.keyword('orange')(errors)))
    process.exit(1)
  }
})()

const groupPlayerList = (playerListArrayRaw) => {
  let playerListArray = [
    {
      name: embedTranslation.players.title,
      value: embedTranslation.players.description
        .replace(/\{playeronline\}/gi, playerListArrayRaw.online)
        .replace(/\{playermax\}/gi, playerListArrayRaw.max),
    },
  ]
  const groups = [[], [], []]
  playerListArrayRaw.list.forEach((person, index) => {
    groups[index % 3].push(person.name_clean ?? person)
  })
  for (let i = 0; i < 3; i++) {
    if (groups[i][0] === undefined) continue
    if (groups[i][1] === undefined) {
      playerListArray.push({
        name: ` • ${groups[i][0]}`,
        value: '‎ ',
        inline: true,
      })
    } else {
      playerListArray.push({
        name: `• ${groups[i][0]}`,
        value: `**• ${groups[i].slice(1).join('\n• ')}**`,
        inline: true,
      })
    }
  }
  return playerListArray
}

const getError = (error, errorMsg) => {
  if (config.settings.logging.error) {
    console.log(
      `${getDateNow()} | ${chalk.red('ERROR')} | ${chalk.bold(consoleLogTranslation.error[errorMsg])}: ${chalk.keyword(
        'orange'
      )(error.message)}`
    )
  }
}

const getDebug = (debugMessage) => {
  if (config.settings.logging.debug) {
    console.log(`${chalk.gray(getDateNow())} | ${chalk.yellow('DEBUG')} | ${chalk.bold(debugMessage)}`)
  }
}

const getPlayersList = async (playerListRaw) => {
  try {
    let playerListArray = [
      {
        name: embedTranslation.players.title,
        value: embedTranslation.players.description
          .replace(/\{playeronline\}/gi, playerListRaw.online)
          .replace(/\{playermax\}/gi, playerListRaw.max),
      },
    ]
    if (!playerListRaw.list?.length || config.mcserver.type === 'bedrock') {
      return playerListArray
    } else {
      playerListArray = groupPlayerList(playerListRaw)
      return playerListArray
    }
  } catch (error) {
    getError(error, 'playerList')
  }
}

const getServerDataAndPlayerList = async () => {
  try {
    const data =
      config.mcserver.type === 'java'
        ? await statusJava(config.mcserver.ip, config.mcserver.port)
        : await statusBedrock(config.mcserver.ip, config.mcserver.port)
    const isOnline = config.autoChangeStatus.isOnlineCheck ? data.online && data.players.max >= 0 : data.online
    if (isOnline) {
      const playerListArray = await getPlayersList(data.players)
      return { data, playerListArray, isOnline }
    } else {
      let playerListArray = []
      return { data, playerListArray, isOnline }
    }
  } catch (error) {
    getError(error, 'fetchServerDataAndPlayerList')
  }
}

const getServerDataOnly = async () => {
  try {
    const data =
      config.mcserver.type === 'java'
        ? await statusJava(config.mcserver.ip, config.mcserver.port)
        : await statusBedrock(config.mcserver.ip, config.mcserver.port)
    const isOnline = config.autoChangeStatus.isOnlineCheck ? data.online && data.players.max >= 0 : data.online
    return { data, isOnline }
  } catch (error) {
    getError(error, 'fetchServerData')
  }
}

const statusMessageEdit = async () => {
  try {
    const { OnlineEmbed, offlineStatus } = require('./embeds')
    let dataRead = fs.readFileSync(`${__dirname}/data.json`, 'utf8')
    dataRead = await JSON.parse(dataRead)
    const channel = await client.channels.fetch(dataRead.channelId)
    const message = await channel.messages.fetch(dataRead.messageId)
    const { data, playerListArray, isOnline } = await getServerDataAndPlayerList()
    if (isOnline) {
      await message.edit({
        content: '',
        embeds: [await OnlineEmbed(data, playerListArray)],
      })
      getDebug(
        consoleLogTranslation.debug.autoChangeStatus.format.replace(
          /\{statusText\}/gi,
          chalk.green(
            consoleLogTranslation.debug.autoChangeStatus.onlineText.replace(/\{playerOnline\}/gi, data.players.online)
          )
        )
      )
    } else {
      await message.edit({
        content: '',
        embeds: [offlineStatus()],
      })
      getDebug(
        consoleLogTranslation.debug.autoChangeStatus.format.replace(
          /\{statusText\}/gi,
          chalk.red(consoleLogTranslation.debug.autoChangeStatus.offlineText)
        )
      )
    }
  } catch (error) {
    getError(error, 'messageEdit')
  }
}

module.exports = {
  getServerDataAndPlayerList,
  getError,
  getDateNow,
  getServerDataOnly,
  getDebug,
  statusMessageEdit,
  embedTranslation,
  consoleLogTranslation,
  cmdSlashTranslation,
}

new CommandKit({
  client,
  eventsPath: `${__dirname}/events`,
  commandsPath: `${__dirname}/commands`,
  bulkRegister: true,
})

client.login(config.bot.token).catch((error) => {
  getError(error, 'botLogin')
})

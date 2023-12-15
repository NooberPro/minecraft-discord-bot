const { Client, IntentsBitField } = require('discord.js')
const { statusBedrock, statusJava } = require('node-mcstatus')
const { settings, bot, mcserver, autoChangeStatus, playerCountCH } = require('../config')
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
    timeZone: !settings.logging.timezone ? Intl.DateTimeFormat().resolvedOptions().timezone : settings.logging.timezone,
    timeZoneName: 'shortGeneric',
  })
}

process.on('uncaughtException', (error) => {
  console.log(`${getDateNow()} | ${chalk.redBright('ERROR')} | ${chalk.bold('Uncaught Exception')}:`, error)
})

process.on('unhandledRejection', (reason) => {
  console.log(`${getDateNow()} | ${chalk.redBright('ERROR')} | ${chalk.bold('Unhandled Rejection')}:`, reason)
})

const languageEmbedOuput = settings.language.embeds ? settings.language.embeds : settings.language.main
const embedFileContent = fs.readFileSync(`./translation/${languageEmbedOuput}/embeds.json5`, 'utf8')
const embedTranslation = json5.parse(embedFileContent)

const languageConsoleOuput = settings.language.consoleLog ? settings.language.consoleLog : settings.language.main
const consoleLogFileContent = fs.readFileSync(`./translation/${languageConsoleOuput}/console-log.json5`, 'utf8')
const consoleLogTranslation = json5.parse(consoleLogFileContent)

const cmdSlashLanguageOutput = settings.language.slashCmds ? settings.language.slashCmds : settings.language.main
const cmdSlashContents = fs.readFileSync(`./translation/${cmdSlashLanguageOutput}/slash-cmds.json5`, 'utf8')
const cmdSlashTranslation = json5.parse(cmdSlashContents)

// Runs the checkError Function immediately.
;(() => {
  function isTimeZoneSupported() {
    if (!settings.logging.timezone) return true
    try {
      Intl.DateTimeFormat(undefined, { timeZone: settings.logging.timezone })
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
  checkError(bot.token.startsWith('your-bot-token-here'), consoleLogTranslation.checkErrorConfig.botToken)
  checkError(
    !['online', 'idle', 'dnd', 'invisible'].includes(bot.presence.status.online && bot.presence.status.offline),
    consoleLogTranslation.checkErrorConfig.botPresenceStatus
  )
  checkError(
    !['Playing', 'Listening', 'Watching', 'Competing'].includes(bot.presence.activity),
    consoleLogTranslation.checkErrorConfig.botStatusActivity
  )

  checkError(!['java', 'bedrock'].includes(mcserver.type), consoleLogTranslation.checkErrorConfig.mcType)
  checkError(!mcserver.name, consoleLogTranslation.checkErrorConfig.mcName)
  checkError(!mcserver.version, consoleLogTranslation.checkErrorConfig.mcVersion)

  checkError(
    playerCountCH.enabled && playerCountCH.guildID === 'your-guild-id-here',
    consoleLogTranslation.checkErrorConfig.guildID
  )
  for (const { name } of Object.values(cmdSlashTranslation)) {
    if (!/^[\p{Ll}\p{Lm}\p{Lo}\p{N}\p{sc=Devanagari}\p{sc=Thai}_-]+$/u.test(name)) {
      console.log('The string does not match the pattern:', name)
      process.exit(1)
    }
  }
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
  if (settings.logging.error) {
    console.log(
      `${getDateNow()} | ${chalk.red('ERROR')} | ${chalk.bold(consoleLogTranslation.error[errorMsg])}: ${chalk.keyword(
        'orange'
      )(error.message)}`
    )
  }
}

const getDebug = (debugMessage) => {
  if (settings.logging.debug) {
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
    if (!playerListRaw.list?.length || mcserver.type === 'bedrock') {
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
      mcserver.type === 'java'
        ? await statusJava(mcserver.ip, mcserver.port)
        : await statusBedrock(mcserver.ip, mcserver.port)
    const isOnline = autoChangeStatus.isOnlineCheck ? data.online && data.players.max >= 0 : data.online
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
      mcserver.type === 'java'
        ? await statusJava(mcserver.ip, mcserver.port)
        : await statusBedrock(mcserver.ip, mcserver.port)
    const isOnline = autoChangeStatus.isOnlineCheck ? data.online && data.players.max >= 0 : data.online
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

client.login(bot.token).catch((error) => {
  getError(error, 'botLogin')
})

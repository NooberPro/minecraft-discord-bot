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

const languageEmbedOutput = settings.language.embeds ? settings.language.embeds : settings.language.main
const embedFileContent = fs.readFileSync(`./translation/${languageEmbedOutput}/embeds.json5`, 'utf8')
const embedTranslation = json5.parse(embedFileContent)

const languageConsoleOutput = settings.language.consoleLog ? settings.language.consoleLog : settings.language.main
const consoleLogFileContent = fs.readFileSync(`./translation/${languageConsoleOutput}/console-log.json5`, 'utf8')
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

  checkError(!isTimeZoneSupported(), consoleLogTranslation.checkErrorConfig.timeZone)
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

  for (const key in cmdSlashTranslation) {
    if (cmdSlashTranslation.hasOwnProperty(key)) {
      const cmdObject = cmdSlashTranslation[key]
      const cmdName = cmdObject.name
      if (cmdName === 'help') {
        if (!/^[\p{Ll}\p{Lm}\p{Lo}\p{N}\p{sc=Devanagari}\p{sc=Thai}_-]+$/u.test(cmdObject.options.name)) {
          errors.push(
            consoleLogTranslation.checkErrorConfig.slashCmdName
              .replace(/\{givenCmdName\}/gi, cmdObject.options.name)
              .replace(/\{cmdName\}/gi, key + '.options')
          )
        }
      }
      if (!/^[\p{Ll}\p{Lm}\p{Lo}\p{N}\p{sc=Devanagari}\p{sc=Thai}_-]+$/u.test(cmdName)) {
        errors.push(
          consoleLogTranslation.checkErrorConfig.slashCmdName
            .replace(/\{givenCmdName\}/gi, cmdName)
            .replace(/\{cmdName\}/gi, key)
        )
      }
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
    console.log(`${getDateNow()} | ${chalk.red('ERROR')} | ${chalk.bold(consoleLogTranslation.error[errorMsg])}:`)
    console.log(error)
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

const getServerDataAndPlayerList = async (dataOnly) => {
  try {
    const data =
      mcserver.type === 'java'
        ? await statusJava(mcserver.ip, mcserver.port)
        : await statusBedrock(mcserver.ip, mcserver.port)
    const isOnline = autoChangeStatus.isOnlineCheck ? data.online && data.players.max > 0 : data.online
    if (isOnline) {
      if (dataOnly) return { data, isOnline }
      const playerListArray = await getPlayersList(data.players)
      return { data, playerListArray, isOnline }
    } else {
      let playerListArray = []
      return { data, playerListArray, isOnline }
    }
  } catch (error) {
    if (dataOnly) {
      getError(error, 'fetchServerData')
      return
    }
    getError(error, 'fetchServerDataAndPlayerList')
  }
}

const removeUnusedEmojis = async (playerListRaw, emojisList) => {
  // Remove emojis that are not in the player list.
  for (const emojis of emojisList) {
    if (!playerListRaw.list.some((player) => player.name_clean === emojis[1].name)) {
      await emojis[1].delete()
    }
  }
}

const getPlayersListWithEmoji = async (playerListRaw) => {
  try {
    const emojisList = await client.application.emojis.fetch()
    const playerList = []

    // If the player avatar is in the emoji list, add it to the player list
    for (const emojis of emojisList) {
      if (playerListRaw.list.some((player) => player.name_clean === emojis[1].name)) {
        playerList.push({ name_clean: `<:${emojis[1].name}:${emojis[1].id}> ${emojis[1].name}` })
      }
    }

    // CHECKING IF PLAYER LIST IN EMOJIS LIST , IF NOT THEN CREATE IT.
    for (const { name_clean, uuid } of playerListRaw.list) {
      if (emojisList.some((emoji) => emoji.name === name_clean)) continue
      const createEmoji = await client.application.emojis.create({
        attachment: `https://api.mineatar.io/head/${uuid}?scale=8&overlay=true`,
        name: name_clean,
      })
      playerList.push({
        name_clean: `<:${createEmoji.name}:${createEmoji.id}> ${createEmoji.name}`,
      })
    }

    const result = groupPlayerList({
      online: playerListRaw.online,
      max: playerListRaw.max,
      list: playerList,
    })

    removeUnusedEmojis(playerListRaw, emojisList)

    return result
  } catch (error) {
    if (!settings.logging.errorLog) return
    getErrorMessage(error, 'playerAvatarEmojiError')
  }
}

const statusMessageEdit = async (ip, port, type, name, message, isPlayerAvatarEmoji) => {
  try {
    const { EmbedBuilder } = require('discord.js')
    const data = type === 'java' ? await statusJava(ip, port) : await statusBedrock(ip, port)
    const isOnline = autoChangeStatus.isOnlineCheck ? data.online && data.players.max > 0 : data.online

    const ipBedrock = `IP: \`${ip}\`\nPort: \`${port}\``
    const portNumber = port === 25565 ? '' : `:\`${port}\``
    const ipJava = `**IP: \`${ip}\`${portNumber}**`
    const ipaddress = type === 'bedrock' ? ipBedrock : ipJava

    if (isOnline) {
      const playerList =
        isPlayerAvatarEmoji && autoChangeStatus.playerAvatarEmoji
          ? await getPlayersListWithEmoji(data.players)
          : await getPlayersList(data.players)

      function editDescriptionFields(description) {
        const isVersion = type === 'java' ? data.version.name_clean : data.version.name
        let string = description
          .trim()
          .replace(/\{ip\}/gi, ipaddress)
          .replace(/\{motd\}/gi, data.motd.clean)
          .replace(/\{version\}/gi, isVersion)
          .replace(/\{siteText\}/gi, '')
        return string
      }
      let description_field_one = editDescriptionFields(embedTranslation.onlineEmbed.description_field_one)
      let description_field_two = editDescriptionFields(embedTranslation.onlineEmbed.description_field_two)
      let title = editDescriptionFields(embedTranslation.onlineEmbed.title)

      const onlineEmbed = new EmbedBuilder()
        .setColor(settings.embedsColors.online)
        .setAuthor({
          name: name,
        })
        .setThumbnail(`https://api.mcstatus.io/v2/icon/${ip}:${port}`)
        .setTitle(title)
        .addFields(playerList)
        .addFields({
          name: description_field_one,
          value: description_field_two,
        })
        .setTimestamp()
        .setFooter({ text: embedTranslation.onlineEmbed.footer })
      await message.edit({
        content: '',
        embeds: [onlineEmbed],
      })
    } else {
      const { offlineStatus } = require('./embeds')
      await message.edit({
        content: '',
        embeds: [offlineStatus()],
      })
    }
  } catch (error) {
    getError(error, 'messageEdit')
  }
}

module.exports = {
  getServerDataAndPlayerList,
  getError,
  getDateNow,
  getDebug,
  statusMessageEdit,
  getPlayersList,
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

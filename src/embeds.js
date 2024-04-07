const { EmbedBuilder } = require('discord.js')
const { mcserver, commands, settings } = require('../config')
const { embedTranslation } = require('./index')

const ipBedrock = `IP: \`${mcserver.ip}\`\nPort: \`${mcserver.port}\``
const port = mcserver.port === 25565 ? '' : `:\`${mcserver.port}\``
const ipJava = `**IP: \`${mcserver.ip}\`${port}**`
const ip = mcserver.type === 'bedrock' ? ipBedrock : ipJava

// Embed Message for site commands
const siteEmbed = new EmbedBuilder()
  .setColor(settings.embedsColors.basicCmds)
  .setThumbnail(mcserver.icon)
  .setAuthor({
    name: mcserver.name,
  })
  .setTitle(embedTranslation.site.title.replace(/\{site\}/gi, mcserver.site))
  .setDescription(embedTranslation.site.description.replace(/\{site\}/gi, mcserver.site))

// Embed Message for version commands
const versionEmbed = new EmbedBuilder()
  .setColor(settings.embedsColors.basicCmds)
  .setThumbnail(mcserver.icon)
  .setAuthor({
    name: mcserver.name,
  })
  .setTitle(embedTranslation.version.title.replace(/\{version\}/gi, mcserver.version))
  .setDescription(embedTranslation.version.description.replace(/\{version\}/gi, mcserver.version))

// Embed Message for ip commands
const ipEmbed = new EmbedBuilder()
  .setColor(settings.embedsColors.basicCmds)
  .setThumbnail(mcserver.icon)
  .setAuthor({
    name: mcserver.name,
  })
  .setTitle(embedTranslation.ip.title.replace(/\{ip\}/gi, ip))
  .setDescription(embedTranslation.ip.description.replace(/\{ip\}/gi, ip))

// Offline Embed Message status commands
const offlineStatus = () => {
  const offlineEmbed = new EmbedBuilder()
    .setColor(settings.embedsColors.offline)
    .setTitle(
      embedTranslation.offlineEmbed.title
        .replace(/\{ip\}/gi, ip)
        .replace(/\{version\}/gi, mcserver.version)
        .replace(/\{site\}/gi, mcserver.site)
    )
    .setThumbnail(mcserver.icon)
    .setAuthor({
      name: mcserver.name,
    })
    .setTimestamp()
    .setFooter({ text: embedTranslation.offlineEmbed.footer })
  if (embedTranslation.offlineEmbed.description) {
    offlineEmbed.setDescription(
      embedTranslation.offlineEmbed.description
        .replace(/\{ip\}/gi, ip)
        .replace(/\{version\}/gi, mcserver.version)
        .replace(/\{site\}/gi, mcserver.site)
    )
  }
  return offlineEmbed
}

// MOTD Embed for motd commands
const motdEmbed = async () => {
  const { getServerDataOnly } = require('./index')
  const { data, isOnline } = await getServerDataOnly()
  if (!isOnline) {
    return offlineStatus()
  } else {
    return new EmbedBuilder()
      .setColor(settings.embedsColors.online)
      .setThumbnail(mcserver.icon)
      .setAuthor({
        name: mcserver.name,
      })
      .setTitle(embedTranslation.motd.title.replace(/\{motd\}/gi, data.motd.clean))
      .setDescription(embedTranslation.motd.description.replace(/\{motd\}/gi, data.motd.clean))
      .setFooter({ text: 'Checked at' })
      .setTimestamp()
  }
}
// Embed Message for players commands
const playerList = async () => {
  try {
    const { getServerDataAndPlayerList } = require('./index')
    const { playerListArray, isOnline } = await getServerDataAndPlayerList()
    if (!isOnline) {
      return offlineStatus()
    } else {
      return new EmbedBuilder()
        .setColor(settings.embedsColors.online)
        .setThumbnail(mcserver.icon)
        .setAuthor({
          name: mcserver.name,
        })
        .addFields(playerListArray)
        .setTimestamp()
        .setFooter({ text: embedTranslation.offlineEmbed.footer })
    }
  } catch (error) {
    const { getError } = require('./index')
    getError(error, 'playerEmbed')
  }
}

// Online Embed Message for status commands
const statusEmbed = async () => {
  const { getServerDataAndPlayerList } = require('./index')
  const { data, playerListArray, isOnline } = await getServerDataAndPlayerList()
  if (isOnline) {
    return await OnlineEmbed(data, playerListArray)
  } else {
    return offlineStatus()
  }
}

// Online Embed Message for status commands
const OnlineEmbed = async (data, playerlist) => {
  try {
    function editDescriptionFields(description) {
      let siteText = mcserver.site ? embedTranslation.onlineEmbed.siteText.replace(/\{site\}/gi, mcserver.site) : ''
      let string = description
        .trim()
        .replace(/\{ip\}/gi, ip)
        .replace(/\{motd\}/gi, data.motd.clean)
        .replace(/\{version\}/gi, mcserver.version)
        .replace(/\{siteText\}/gi, siteText)
      return string
    }
    let description_field_one = editDescriptionFields(embedTranslation.onlineEmbed.description_field_one)
    let description_field_two = editDescriptionFields(embedTranslation.onlineEmbed.description_field_two)
    let title = editDescriptionFields(embedTranslation.onlineEmbed.title)
    return new EmbedBuilder()
      .setColor(settings.embedsColors.online)
      .setThumbnail(mcserver.icon)
      .setAuthor({
        name: mcserver.name,
      })
      .setTitle(title)
      .addFields(playerlist)
      .addFields({
        name: description_field_one,
        value: description_field_two,
      })
      .setTimestamp()
      .setFooter({ text: embedTranslation.onlineEmbed.footer })
  } catch (error) {
    const { getError } = require('./index')
    getError(error, 'statusEmbed')
  }
}

const helpEmbed = async (client, commandName) => {
  const commandsFetch = await client.application.commands.fetch()
  if (commandName) {
    let slashCmdData
    await commandsFetch.forEach((slashCmd) => {
      if (slashCmd.name === commandName) {
        slashCmdData = slashCmd
      }
    })
    return new EmbedBuilder()
      .setAuthor({
        name: client.user.username,
        iconURL: client.user.avatarURL(),
      })
      .setColor('Yellow')
      .setTitle(
        embedTranslation.help.commandInfoFormat.title.replace(
          /\{cmdName\}/gi,
          slashCmdData.name.charAt(0).toUpperCase() + slashCmdData.name.slice(1)
        )
      )
      .setDescription(
        embedTranslation.help.commandInfoFormat.description
          .replace(/\{cmdSlashMention\}/gi, `</${slashCmdData.name}:${slashCmdData.id}>`)
          .replace(/\{cmdDescription\}/gi, slashCmdData.description)
          .replace(/\{prefixCmd\}/gi, commands.prefixCommands.prefix + slashCmdData.name)
          .replace(
            /\{prefixCmdAlias\}/gi,
            commands[slashCmdData.name].alias.length ? `\`${commands[slashCmdData.name].alias.join('`, `')}\`` : ''
          )
      )
  }

  visibleCmdsNames = []
  // Get the commands enabled from config and add to visibleCmdsNames
  for (const cmds in commands) {
    if (commands[cmds].enabled) {
      visibleCmdsNames.push(cmds)
    }
  }
  const cmdsList = []

  // If commands in fetched data is in the config and enabled then it will show in embed
  commandsFetch.forEach((command) => {
    if (visibleCmdsNames.includes(command.name)) {
      cmdsList.push(
        embedTranslation.help.listFormat
          .replace(/\{slashCmdMention\}/gi, `</${command.name}:${command.id}>`)
          .replace(/\{cmdDescription\}/gi, command.description)
      )
    }
  })

  return new EmbedBuilder()
    .setTitle(embedTranslation.help.title.replace(/\{prefix\}/gi).replace(/\{botName\}/gi, client.user.username))
    .setColor('Yellow')
    .setAuthor({
      name: client.user.username,
      iconURL: client.user.avatarURL(),
    })
    .setDescription(
      `${embedTranslation.help.description
        .replace(/\{prefix\}/gi, commands.prefixCommands.prefix)
        .replace(/\{botName\}/gi, client.user.username)}\n${cmdsList.join('\n')}`
    )
}

const botInfoEmbed = async (interaction, client) => {
  const process = require('node:process')
  const reply = await interaction.fetchReply()
  const ping = reply.createdTimestamp - interaction.createdTimestamp
  const os = require('os')
  const cpuUsage = (os.loadavg()[0] / os.cpus().length).toFixed(2)
  const memoryUsage = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)
  const nodeVersion = process.version
  const uptimeSeconds = Math.floor(process.uptime())
  const uptimeMinutes = Math.floor(uptimeSeconds / 60) % 60
  const uptimeHours = Math.floor(uptimeMinutes / 60) % 24
  const uptimeDays = Math.floor(uptimeHours / 24)
  return new EmbedBuilder()
    .setAuthor({
      name: client.user.tag,
      iconURL: client.user.avatarURL(),
    })
    .setTitle(embedTranslation.info.title)
    .setColor('Yellow')
    .setDescription(
      embedTranslation.info.description
        .replace(/\{cpuUsage\}/gi, cpuUsage)
        .replace(/\{memoryUsage\}/gi, memoryUsage)
        .replace(/\{nodeVersion\}/gi, nodeVersion)
        .replace(/\{uptimeDays\}/gi, uptimeDays)
        .replace(/\{uptimeHours\}/gi, uptimeHours)
        .replace(/\{uptimeMinutes\}/gi, uptimeMinutes)
        .replace(/\{uptimeSeconds\}/gi, uptimeSeconds)
        .replace(/\{ping\}/gi, ping)
        .replace(/\{websocket\}/gi, client.ws.ping)
    )
}

module.exports = {
  versionEmbed,
  siteEmbed,
  offlineStatus,
  ipEmbed,
  ip,
  playerList,
  statusEmbed,
  OnlineEmbed,
  motdEmbed,
  helpEmbed,
  botInfoEmbed,
}

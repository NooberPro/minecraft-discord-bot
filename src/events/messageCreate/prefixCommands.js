const config = require('../../../config')
const { commands, settings } = require('../../../config')
const { ipEmbed, siteEmbed, playerList, versionEmbed, statusEmbed, motdEmbed, helpEmbed } = require('../../embeds')
const json5 = require('json5')
const fs = require('fs')

const cmdSlashLanguage = settings.language.slashCmds ? settings.language.slashCmds : settings.language.main
const fileContents = fs.readFileSync(`./translation/${cmdSlashLanguage}/slash-cmds.json5`, 'utf8')
const cmdSlashRead = json5.parse(fileContents)

module.exports = async (message, client) => {
  if (
    message.author.bot ||
    !commands.prefixCommands.enabled ||
    !commands.prefixCommands.prefix ||
    !message.content.startsWith(commands.prefixCommands.prefix)
  )
    return

  const prefix = commands.prefixCommands.prefix
  const content = message.content.slice(prefix.length)

  if (commands.help.enabled && (content === 'help' || commands.help.alias.includes(content))) {
    message.channel.send({ embeds: [await helpEmbed(client)] })
  }
  if (commands.motd.enabled && (content === 'motd' || commands.motd.alias.includes(content))) {
    await message.channel.sendTyping()
    message.channel.send({ embeds: [await motdEmbed()] })
  }
  if (commands.ip.enabled && (content === 'ip' || commands.ip.alias.includes(content))) {
    message.channel.send({ embeds: [ipEmbed] })
  }
  if (commands.site.enabled && config.mcserver.site && (content === 'site' || commands.site.alias.includes(content))) {
    message.channel.send({ embeds: [siteEmbed] })
  }
  if (commands.version.enabled && (content === 'version' || commands.version.alias.includes(content))) {
    message.channel.send({ embeds: [versionEmbed] })
  }

  if (commands.players.enabled && (content === 'players' || commands.players.alias.includes(content))) {
    await message.channel.sendTyping()
    message.channel.send({ embeds: [await playerList()] })
  }
  if (commands.status.enabled && (content === 'status' || commands.status.alias.includes(content))) {
    await message.channel.sendTyping()
    try {
      message.channel.send({ embeds: [await statusEmbed()] })
    } catch (error) {
      message.channel.send(cmdSlashRead.status.errorReply)
      const { getError } = require('../../index')
      getError(error, 'statusPrefix')
    }
  }
}

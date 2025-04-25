const { commands, mcserver } = require('../../../config')
const { cmdSlashTranslation, isChannelAllowed } = require('./../../index')
const { ipEmbed, siteEmbed, playerList, versionEmbed, statusEmbed, motdEmbed, helpEmbed } = require('../../embeds')

module.exports = async (message, client) => {
  if (
    message.author.bot ||
    !commands.prefixCommands.enabled ||
    !commands.prefixCommands.prefix ||
    !message.content.startsWith(commands.prefixCommands.prefix)
  )
    return
  if (!isChannelAllowed(message.channelId, false)) {
    const msgReply = await message.reply(cmdSlashTranslation.disabledChannelMsg)
    setTimeout(async () => {
      try {
        await msgReply.delete()
        await message.delete()
      } catch (error) {
        if (error.message === 'Unknown Message') return
        getError(error, 'autoReplyMsgDelete')
      }
    }, 5000)
    return
  }
  const prefix = commands.prefixCommands.prefix
  const content = message.content.slice(prefix.length)

  if (commands.help.enabled && (content.startsWith('help') || commands.help.alias.includes(content))) {
    await message.channel.sendTyping()
    const arg = content.split(' ')
    if (arg[1]) {
      const commandsChoicesArray = []
      for (const cmds in commands) {
        if (commands[cmds].enabled && !['slashCommands', 'prefixCommands', 'language'].includes(cmds)) {
          commandsChoicesArray.push(cmds)
        }
      }
      if (commandsChoicesArray.includes(arg[1])) {
        message.channel.send({ embeds: [await helpEmbed(client, arg[1])] })
        return
      }
    }
    message.channel.send({ embeds: [await helpEmbed(client)] })
  }
  if (commands.motd.enabled && (content === 'motd' || commands.motd.alias.includes(content))) {
    await message.channel.sendTyping()
    message.channel.send({ embeds: [await motdEmbed()] })
  }
  if (commands.ip.enabled && (content === 'ip' || commands.ip.alias.includes(content))) {
    message.channel.send({ embeds: [ipEmbed] })
  }
  if (commands.site.enabled && mcserver.site && (content === 'site' || commands.site.alias.includes(content))) {
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
      message.channel.send(cmdSlashTranslation.status.errorReply)
      const { getError } = require('../../index')
      getError(error, 'statusPrefix')
    }
  }
}

const { autoReply, mcserver, commands, settings } = require('../../../config')
const fs = require('fs')
const json5 = require('json5')

const fileContents = fs.readFileSync(`./translation/${commands.language}/auto-reply.json5`, 'utf8')
const autoReplyReplyText = json5.parse(fileContents)

module.exports = async (msg) => {
  try {
    if (!autoReply.enabled || msg.author.bot || msg.content.startsWith(commands.prefixCommands.prefix)) return
    const { content } = msg
    const { ip, site, status, version } = autoReply
    const isIp = new RegExp(`\\b(${ip.triggerWords.join('|')})\\b`)
    const isSite = new RegExp(`\\b(${site.triggerWords.join('|')})\\b`)
    const isStatus = new RegExp(`\\b(${status.triggerWords.join('|')})\\b`)
    const isVersion = new RegExp(`\\b(${version.triggerWords.join('|')})\\b`)

    if (isIp.test(content) && autoReply.ip.enabled) {
      msg.channel.send(
        autoReplyReplyText.autoReply.ip.replyText.replace(/{ip}/g, mcserver.ip).replace(/{port}/g, mcserver.port)
      )
    }
    if (isSite.test(content) && autoReply.site.enabled && mcserver.site) {
      msg.channel.send(autoReplyReplyText.autoReply.site.replyText.replace(/{site}/g, mcserver.site))
    }
    if (isVersion.test(content) && autoReply.version.enabled) {
      msg.channel.send(autoReplyReplyText.autoReply.version.replyText.replace(/{version}/g, mcserver.version))
    }
    if (isStatus.test(content) && autoReply.status.enabled) {
      await msg.channel.sendTyping()
      const { getServerDataOnly } = require('../../index')
      const { data, isOnline } = await getServerDataOnly()
      msg.channel.send(
        autoReplyReplyText.autoReply.isOnline
          ? status.onlineReply.replace(/{playerOnline}/g, data.players.online).replace(/{playerMax}/g, data.players.max)
          : status.offlineReply
      )
    }
  } catch (error) {
    const { getError } = require('../../index')
    getError(error, 'autoReply')
  }
}

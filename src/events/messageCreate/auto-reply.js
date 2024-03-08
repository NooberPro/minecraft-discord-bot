const { autoReply, mcserver, commands, settings } = require('../../../config')
const fs = require('fs')
const json5 = require('json5')

const languageAutoReply = settings.language.autoReply ? settings.language.autoReply : settings.language.main
const fileContents = fs.readFileSync(`./translation/${languageAutoReply}/auto-reply.json5`, 'utf8')
const autoReplyReplyText = json5.parse(fileContents)

module.exports = async (msg) => {
  try {
    if (!autoReply.enabled || msg.author.bot || msg.content.startsWith(commands.prefixCommands.prefix)) return
    const { content } = msg
    const { ip, site, status, version } = autoReply
    const isIp = new RegExp(`(?<=^|\\P{L})(${ip.triggerWords.join('|')})(?=\\P{L}|$)`, 'iu')
    const isSite = new RegExp(`(?<=^|\\P{L})(${site.triggerWords.join('|')})(?=\\P{L}|$)`, 'iu')
    const isStatus = new RegExp(`(?<=^|\\P{L})(${status.triggerWords.join('|')})(?=\\P{L}|$)`, 'iu')
    const isVersion = new RegExp(`(?<=^|\\P{L})(${version.triggerWords.join('|')})(?=\\P{L}|$)`, 'iu')

    if (isIp.test(content) && autoReply.ip.enabled) {
      msg.reply(autoReplyReplyText.ip.replyText.replace(/{ip}/g, mcserver.ip).replace(/{port}/g, mcserver.port))
    }
    if (isSite.test(content) && autoReply.site.enabled && mcserver.site) {
      msg.reply(autoReplyReplyText.site.replyText.replace(/{site}/g, mcserver.site))
    }
    if (isVersion.test(content) && autoReply.version.enabled) {
      msg.reply(autoReplyReplyText.version.replyText.replace(/{version}/g, mcserver.version))
    }
    if (isStatus.test(content) && autoReply.status.enabled) {
      await msg.channel.sendTyping()
      const { getServerDataOnly } = require('../../index')
      const { data, isOnline } = await getServerDataOnly()
      msg.reply(
        isOnline
          ? autoReplyReplyText.status.onlineReply
              .replace(/{playerOnline}/g, data.players.online)
              .replace(/{playerMax}/g, data.players.max)
          : autoReplyReplyText.status.offlineReply
      )
    }
  } catch (error) {
    const { getError } = require('../../index')
    getError(error, 'autoReply')
  }
}

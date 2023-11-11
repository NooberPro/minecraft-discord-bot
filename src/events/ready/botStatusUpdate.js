const { bot, settings } = require('../../../config')
const chalk = require('chalk')
const fs = require('fs')
const json5 = require('json5')

module.exports = (client) => {
  languageConsoleOuput = settings.language.consoleLog ? settings.language.consoleLog : settings.language.main
  const consoleLogData = fs.readFileSync(`./translation/${languageConsoleOuput}/console-log.json5`, 'utf8')
  const consoleLog = json5.parse(consoleLogData)

  const botStatusUpdate = async () => {
    const { getDebug, getServerDataOnly } = require('../../index')
    const { ActivityType } = require('discord.js')
    if (bot.presence.enabled) {
      try {
        const { data, isOnline } = await getServerDataOnly()
        if (isOnline) {
          let statusText = bot.presence.text.online
            .replace(/{playeronline}/g, data.players.online)
            .replace(/{playermax}/g, data.players.max)
          client.user.setActivity(statusText, {
            type: ActivityType[bot.presence.activity],
          })
          await client.user.setStatus(bot.presence.status.online)
          getDebug(
            consoleLog.debug.botStatusFormat.replace(
              /\{botStatusText\}/gi,
              chalk.green(`${bot.presence.activity} ${statusText}`)
            )
          )
        } else {
          client.user.setStatus(bot.presence.status.offline)
          client.user.setActivity(bot.presence.text.offline, {
            type: ActivityType[bot.presence.activity],
          })
          getDebug(
            consoleLog.debug.botStatusFormat.replace(
              /\{botStatusText\}/gi,
              chalk.red(`${bot.presence.activity} ${bot.presence.text.offline}`)
            )
          )
        }
      } catch (error) {
        const { getError } = require('../../index')
        getError(error, 'botStatusUpdate')
      }
    }
  }
  if (bot.presence.enabled) {
    botStatusUpdate()
    setInterval(botStatusUpdate, 60000)
  }
}

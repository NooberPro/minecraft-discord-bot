const { bot } = require('../../../config')
const { consoleLogTranslation } = require('../../index')
const chalk = require('chalk')

module.exports = (client) => {
  const botStatusUpdate = async () => {
    const { getDebug, getServerDataAndPlayerList } = require('../../index')
    const { ActivityType } = require('discord.js')
    if (bot.presence.enabled) {
      try {
        const { data, isOnline } = await getServerDataAndPlayerList(true)
        const statusEmojis = {
          online: '🟢',
          idle: '🌙',
          dnd: '⛔',
          invisible: '⚫',
        }

        if (isOnline) {
          let statusText = bot.presence.text.online
            .replace(/{playeronline}/g, data.players.online)
            .replace(/{playermax}/g, data.players.max)

          const presence = await client.user.setPresence({
            status: bot.presence.status.online,
            activities: [
              {
                name: statusText,
                type: ActivityType[bot.presence.activity],
              },
            ],
          })
          if (presence.activities.length > 0) {
            presence.activities.forEach((activity) => {
              const statusEmoji = statusEmojis[presence.status] || ''
              getDebug(
                consoleLogTranslation.debug.botStatusFormat.replace(
                  /\{botStatusText\}/gi,
                  chalk.green(
                    `${statusEmoji} ${presence.status.toUpperCase()} ${ActivityType[activity.type]} ${activity.name}`
                  )
                )
              )
            })
          }
        } else {
          const presence = await client.user.setPresence({
            status: bot.presence.status.offline,
            activities: [
              {
                name: bot.presence.text.offline,
                type: ActivityType[bot.presence.activity],
              },
            ],
          })

          if (presence.activities.length > 0) {
            presence.activities.forEach((activity) => {
              const statusEmoji = statusEmojis[presence.status] || ''
              getDebug(
                consoleLogTranslation.debug.botStatusFormat.replace(
                  /\{botStatusText\}/gi,
                  chalk.red(
                    `${statusEmoji} ${presence.status.toUpperCase()} ${ActivityType[activity.type]} ${activity.name}`
                  )
                )
              )
            })
          }
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

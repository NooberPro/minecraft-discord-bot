const fs = require('fs')
const { statusMessageEdit, consoleLogTranslation, getError } = require('../../index.js')
const chalk = require('chalk')
const config = require('../../../config.js')

module.exports = async (client) => {
  if (!config.autoChangeStatus.enabled) return
  try {
    const autoChangeStatus = async () => {
      let dataRead = JSON.parse(fs.readFileSync(`${__dirname}/../../data.json`, 'utf8'))
      let messagesIdArray = []
      try {
        let lastTrueIndex = -1
        for (let i = dataRead.autoChangeStatus.length - 1; i >= 0; i--) {
          if (dataRead.autoChangeStatus[i].isPlayerAvatarEmoji === true) {
            lastTrueIndex = i
            break
          }
        }

        const filteredAutoChangeStatus = dataRead.autoChangeStatus.filter((item, index) => {
          if (item.isPlayerAvatarEmoji === true) {
            return index === lastTrueIndex
          }
          return true
        })

        dataRead.autoChangeStatus = filteredAutoChangeStatus

        for (const value of dataRead.autoChangeStatus) {
          const channel = await client.channels.fetch(value.channelId)
          const message = await channel.messages.fetch(value.messageId)
          await statusMessageEdit(value.ip, value.port, value.type, value.name, message, value.isPlayerAvatarEmoji)
          messagesIdArray.push(value)
        }
      } catch (error) {
        if (error.rawError.message === 'Unknown Message') return
        getError(error, 'messageEdit')
      } finally {
        dataRead.autoChangeStatus = messagesIdArray
        fs.writeFileSync('./src/data.json', JSON.stringify(dataRead, null, 2), 'utf8')
      }
    }
    const data = require('../../data.json')
    if (data.autoChangeStatus.length === 0) {
      console.log(
        consoleLogTranslation.debug.autoChangeStatus.enableAutoChangeStatus.replace(
          /\{cmd\}/gi,
          chalk.cyan('"/setstatus"')
        )
      )
    } else {
      autoChangeStatus()
      setInterval(autoChangeStatus, config.autoChangeStatus.updateInterval * 1000)
    }
  } catch (error) {
    getError(error, 'channelIdCheck')
  }
}

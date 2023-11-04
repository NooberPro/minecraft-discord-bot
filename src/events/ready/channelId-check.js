const config = require('../../../config.js')
const { statusMessageEdit } = require('../../index.js')
const chalk = require('chalk')
const fs = require('fs')
const json5 = require('json5')
const consoleLogData = fs.readFileSync(`./translation/${config.commands.language}/console-log.json5`, 'utf8')
const consoleLog = json5.parse(consoleLogData)

module.exports = (client) => {
  try {
    if (!config.autoChangeStatus.enabled) return
    const data = require('../../data.json')
    if (data.channelId === null) {
      console.log(
        consoleLog.debug.autoChangeStatus.enableAutoChangeStatus.replace(/\{cmd\}/gi, chalk.cyan('"/setstatus"'))
      )
    } else {
      statusMessageEdit()
      setInterval(statusMessageEdit, config.autoChangeStatus.updateInterval * 1000)
    }
  } catch (error) {
    const { getError } = require('../../index.js')
    getError(error, 'channelIdCheck')
  }
}

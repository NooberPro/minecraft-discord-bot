const config = require('../../../config.js')
const { statusMessageEdit, consoleLogTranslation } = require('../../index.js')
const chalk = require('chalk')

module.exports = (client) => {
  try {
    if (!config.autoChangeStatus.enabled) return
    const data = require('../../data.json')
    if (data.channelId === null) {
      console.log(
        consoleLogTranslation.debug.autoChangeStatus.enableAutoChangeStatus.replace(
          /\{cmd\}/gi,
          chalk.cyan('"/setstatus"')
        )
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

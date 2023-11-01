const config = require('../../../config.js')
const { statusMessageEdit } = require('../../index.js')
const chalk = require('chalk')
module.exports = (client) => {
  try {
    if (!config.autoChangeStatus.enabled) return
    const data = require('../../data.json')
    if (data.channelId === null) {
      console.log(`To set server status, send a ${chalk.cyan('"/setstatus"')} command in the desired channel.`)
    } else {
      statusMessageEdit()
      setInterval(statusMessageEdit, config.autoChangeStatus.updateInterval * 1000)
    }
  } catch (error) {
    const { getError } = require('../../index.js')
    getError(error, 'channelIdCheck')
  }
}

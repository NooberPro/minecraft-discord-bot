const fs = require('fs');
const config = require('../../../config.js');
const data = JSON.parse(fs.readFileSync('data.json'));
const { statusRetrieval } = require('../../index.js');
const chalk = require('chalk');
module.exports = (client) => {
  if (config.settings.autoChangeStatus === false) return;
  if (data.channelId === null) {
    console.log(
      `To set server status, send a ${chalk.cyan(
        '"!setstatus"'
      )} message in the desired channel.`
    );
  } else {
    setInterval(statusRetrieval, config.bot.updateInterval * 1000);
    statusRetrieval();
  }
};

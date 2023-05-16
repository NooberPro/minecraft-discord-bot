const fs = require('fs');
const config = require('../../../config.js');
const data = JSON.parse(fs.readFileSync('data.json'));
const { statusRetrieval } = require('../../index.js');
const chalk = require('chalk');
module.exports = (client) => {
  try {
    if (!config.settings.autoChangeStatus.enabled) return;

    if (
      data.channelId === null &&
      !config.settings.autoChangeStatus.channelId
    ) {
      console.log(
        `To set server status, send a ${chalk.cyan(
          '"!setstatus"'
        )} message in the desired channel.`
      );
    } else {
      setInterval(
        statusRetrieval,
        config.settings.autoChangeStatus.updateInterval * 1000
      );
      statusRetrieval();
    }
  } catch (error) {
    if ((!config, settings.logging.errorLog)) return;
    console.error(
      chalk.red(`Error with !setstatus update: `),
      chalk.keyword('orange')(error.message)
    );
  }
};

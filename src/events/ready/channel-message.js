const chalk = require('chalk');
const { settings } = require('../../../config');
const { channelId } = require('../../../data.json');
const fs = require('fs');
const { statusUpdate } = require('../../index.js');
module.exports = (client) => {
  try {
    if (!settings.autoChangeStatus.enabled) return;
    if (!settings.autoChangeStatus.channelId) return;
    if (channelId === settings.autoChangeStatus.channelId) return;
    const channel = client.channels.cache.get(
      settings.autoChangeStatus.channelId
    );
    channel
      .send(`:gear: Checking the status..`)
      .then((msg) => {
        const json = {
          messageId: msg.id,
          channelId: settings.autoChangeStatus.channelId,
        };
        fs.writeFileSync('data.json', JSON.stringify(json));
        console.log(
          `The status channel has been set to ${chalk.cyan('#' + channel.name)}`
        );
        setInterval(
          statusUpdate,
          settings.autoChangeStatus.updateInterval * 1000
        );
        statusUpdate();
      })
      .catch((error) => {
        if (!settings.logging.errorLog) return;
        console.error(
          chalk.red(`Error with channelId status: `),
          chalk.keyword('orange')(error.message)
        );
      });
  } catch (error) {
    if (!settings.logging.errorLog) return;
    console.error(
      chalk.red(`Error with channelId status: `),
      chalk.keyword('orange')(error.message)
    );
  }
};

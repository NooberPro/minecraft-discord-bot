const chalk = require('chalk');
const fs = require('fs');
const config = require('../../../config');
module.exports = (message, client) => {
  if (config.settings.autoChangeStatus === false) return;
  if (message.content === '!setstatus') {
    const channel = client.channels.cache.get(message.channel.id);
    if (!channel) return console.error('Invalid channel ID.');
    channel
      .send(`:gear:Checking the status...\nWaiting for bot to restart.`)
      .then((msg) => {
        const json = {
          messageId: null,
          channelId: null,
        };
        fs.writeFileSync('data.json', JSON.stringify(json));
        const data = JSON.parse(fs.readFileSync('data.json'));
        data.messageId = msg.id;
        data.channelId = message.channel.id;
        fs.writeFileSync('data.json', JSON.stringify(data));
        console.log(
          `The status channel has been set to #${chalk.cyan(channel.name)}`
        );
      })
      .catch(console.error);
  }
};

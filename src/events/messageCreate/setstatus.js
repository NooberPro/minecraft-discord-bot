const chalk = require('chalk');
const fs = require('fs');
const { settings } = require('../../../config');
module.exports = (message, client) => {
  try {
    if (!settings.autoChangeStatus.enabled) return;
    if (!settings.autoChangeStatus.setstatus) return;
    if (message.content !== '!setstatus') return;
    if (!message.member.permissions.has('MANAGE_CHANNELS')) {
      message.channel
        .send("You don't have MANAGE CHANNELS Permission.")
        .then((msg) => {
          function deleteMessage() {
            msg.delete().catch((error) => {
              if (!settings.logging.errorLog) return;
              console.error(
                chalk.red(`Error with editing status message:`),
                chalk.keyword('orange')(error.message)
              );
            });
          }
          setTimeout(deleteMessage, 5000);
        });
      return;
    }
    const channel = client.channels.cache.get(message.channel.id);
    channel
      .send(`:gear: Checking the status...\n Waiting for bot to restart`)
      .then((msg) => {
        const json = {
          messageId: msg.id,
          channelId: message.channel.id,
        };
        fs.writeFileSync('data.json', JSON.stringify(json));
        console.log(
          `The status channel has been set to #${chalk.cyan(
            channel.name
          )}. Please Restart the bot.`
        );
      })
      .catch((error) => {
        console.error(
          chalk.red(`Error with !setstaus:`),
          chalk.keyword('orange')(error.message)
        );
      });
  } catch (error) {
    if (!settings.logging.errorLog) return;
    console.error(
      chalk.red(`Error with setstatus: `),
      chalk.keyword('orange')(error.message)
    );
  }
};

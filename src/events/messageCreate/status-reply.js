const config = require('../../../config.js');
const { data } = require('../../index.js');
module.exports = (message) => {
  if (config.status_reply.enabled === false) return;
  if (
    config.status_reply.triggerWords2.some((word) =>
      message.content.includes(word))
    message.reply('**The server's IP is 
  if (
    config.status_reply.triggerWords.some((word) =>
      message.content.includes(word)
    )
  ) {
    if (data.online === true && data.players.max > 0) {
      message.reply(
        `**Yes, server is :green_circle:\`ONLINE\` with \`${data.players.online}\` players playing.**`
      );
    } else {
      message.reply('**The Server is currently :red_circle:`Offline`.**');
    }
  }
};

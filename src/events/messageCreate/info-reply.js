const config = require('../../../config.js');
const { data } = require('../../index.js');
module.exports = (message) => {
  if (config.infoReply.enabled === false) return;
  if (message.author.bot) return;
  const { content } = message;
  const { infoReply, mcserver } = config;

  if (infoReply.triggerWords.ip.some((word) => content.includes(word))) {
    message.reply(
      `**The server's ip address: \`${mcserver.ip}\`: \`${mcserver.port}\` **`
    );
  } else if (
    infoReply.triggerWords.site.some((word) => content.includes(word))
  ) {
    message.reply(`**The server's website link: ${mcserver.site}**`);
  } else if (
    infoReply.triggerWords.status.some((word) => content.includes(word))
  ) {
    message.reply(
      data.online === true && data.players.max > 0
        ? `**The Server is currently :green_circle:\`ONLINE\` with \`${data.players.online}\` players playing.**`
        : '**The Server is currently :red_circle:`Offline`.**'
    );
  } else if (
    infoReply.triggerWords.version.some((word) => content.includes(word))
  ) {
    message.reply(`**The server's version: \`${mcserver.version}\`**`);
  }
};

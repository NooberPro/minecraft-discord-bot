const chalk = require('chalk');
const { infoReply, mcserver, settings } = require('../../../config');
const { getServerData } = require('../../index.js');
const { ip } = require('../../embeds');
module.exports = async (message) => {
  try {
    if (!infoReply.enabled) return;
    if (message.author.bot) return;
    const { content } = message;
    if (infoReply.triggerWords.ip.some((word) => content.includes(word))) {
      message.reply(ip);
    } else if (
      infoReply.triggerWords.site.some((word) => content.includes(word))
    ) {
      message.reply(`**The server's website link: ${mcserver.site}**`);
    } else if (
      infoReply.triggerWords.status.some((word) => content.includes(word))
    ) {
      await message.channel.sendTyping();
      const { data } = await getServerData();
      message.reply(
        data.online && data.players.max > 0
          ? `**The Server is currently :green_circle:\`ONLINE\` with \`${data.players.online}\` players playing.**`
          : '**The Server is currently :red_circle:`Offline`.**'
      );
    } else if (
      infoReply.triggerWords.version.some((word) => content.includes(word))
    ) {
      message.reply(`**The server's version: \`${mcserver.version}\`**`);
    }
  } catch (error) {
    if (!settings.logging.errorLog) return;
    console.error(
      chalk.red(`Error with info reply: `),
      chalk.keyword('orange')(error.message)
    );
  }
};

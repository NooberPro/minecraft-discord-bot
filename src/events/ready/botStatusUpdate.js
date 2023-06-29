const { bot } = require('../../../config');
const chalk = require('chalk');
module.exports = (client) => {
  const botStatusUpdate = async () => {
    const { getDebug, getServerDataOnly } = require('../../index');
    const { ActivityType } = require('discord.js');
    if (bot.presence.enabled) {
      try {
        const { data, isOnline } = await getServerDataOnly();
        if (isOnline) {
          let statusText = bot.presence.text.online
            .replace(/{playeronline}/g, data.players.online)
            .replace(/{playermax}/g, data.players.max);
          client.user.setActivity(statusText, {
            type: ActivityType[bot.presence.activity],
          });
          client.user.setStatus(bot.presence.status.online);
          console.log(
            getDebug(
              'Status of the bot has been set to',
              chalk.green(`${bot.presence.activity} ${statusText}`)
            )
          );
        } else {
          client.user.setStatus(bot.presence.status.offline);
          client.user.setActivity(bot.presence.text.offline, {
            type: ActivityType[bot.presence.activity],
          });
          console.log(
            getDebug(
              'Status of the bot has been set to',
              chalk.red(`${bot.presence.activity} ${bot.presence.text.offline}`)
            )
          );
        }
      } catch (error) {
        const { getError } = require('../../index');
        console.log(getError(error, 'Updating status of the bot'));
      }
    }
  };
  if (bot.presence.enabled) {
    botStatusUpdate();
    setInterval(botStatusUpdate, 60000);
  }
};

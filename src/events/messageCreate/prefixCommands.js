const { commands } = require('../../../config');
const {
  ipEmbed,
  siteEmbed,
  playerList,
  versionEmbed,
  offlineStatus,
  OnlineEmbed,
} = require('../../embeds');
const { getServerData } = require('../../index');
module.exports = async (message) => {
  if (!commands.prefixCommands.prefix) return;
  if (!commands.prefixCommands.enabled) return;
  if (message.author.bot) return;
  if (!message.content.startsWith(commands.prefixCommands.prefix)) return;
  if (
    message.content === commands.prefixCommands.prefix + 'ip' &&
    commands.ip.enablePrefix
  ) {
    message.reply({ embeds: [ipEmbed] });
  } else if (
    message.content === commands.prefixCommands.prefix + 'site' &&
    commands.site.enablePrefix
  ) {
    message.reply({ embeds: [siteEmbed] });
  } else if (
    message.content === commands.prefixCommands.prefix + 'version' &&
    commands.version.enablePrefix
  ) {
    message.reply({ embeds: [versionEmbed] });
  } else if (
    message.content === commands.prefixCommands.prefix + 'players' &&
    commands.players.enablePrefix
  ) {
    await message.channel.sendTyping();
    const playersEmbed = await playerList();
    message.reply({ embeds: [playersEmbed] });
  } else if (
    message.content === commands.prefixCommands.prefix + 'status' &&
    commands.status.enablePrefix
  ) {
    await message.channel.sendTyping();
    try {
      const { data, playerList } = await getServerData();
      if (!data.online) {
        message.reply({ embeds: [offlineStatus] });
      } else {
        const onlineEmbed = await OnlineEmbed(data, playerList);
        message.reply({ embeds: [onlineEmbed] });
      }
    } catch (error) {
      message.reply({ embeds: [offlineStatus] });
      if (!config.settings.logging.errorLog) return;
      console.error(
        chalk.red(`An error wiht prefix status command:`),
        chalk.keyword('orange')(error.message)
      );
    }
  }
};

const config = require('../../../config');
const { commands, settings } = require('../../../config');
const {
  ipEmbed,
  siteEmbed,
  playerList,
  versionEmbed,
  offlineStatus,
  statusEmbed,
  motdEmbed,
  helpEmbed,
} = require('../../embeds');

module.exports = async (message, client) => {
  if (
    message.author.bot ||
    !commands.prefixCommands.enabled ||
    !commands.prefixCommands.prefix ||
    !message.content.startsWith(commands.prefixCommands.prefix)
  )
    return;

  const prefix = commands.prefixCommands.prefix;
  const content = message.content.slice(prefix.length);

  switch (content) {
    case 'help':
      if (commands.help.prefixEnable) {
        message.channel.send({ embeds: [helpEmbed(client)] });
      }
      break;
    case 'motd':
      if (commands.motd.prefixEnable) {
        await message.channel.sendTyping();
        message.channel.send({ embeds: [await motdEmbed()] });
      }
      break;
    case 'ip':
      if (commands.ip.prefixEnable) {
        message.channel.send({ embeds: [ipEmbed] });
      }
      break;
    case 'site':
      if (commands.site.prefixEnable && config.mcserver.site) {
        message.channel.send({ embeds: [siteEmbed] });
      }
      break;
    case 'version':
      if (commands.version.prefixEnable) {
        message.channel.send({ embeds: [versionEmbed] });
      }
      break;
    case 'players':
      if (commands.players.prefixEnable) {
        await message.channel.sendTyping();
        message.channel.send({ embeds: [await playerList()] });
      }
      break;
    case 'status':
      if (commands.status.prefixEnable) {
        await message.channel.sendTyping();
        try {
          message.channel.send({ embeds: [await statusEmbed()] });
        } catch (error) {
          message.channel.send({ embeds: [offlineStatus()] });
          if (settings.logging.error) {
            const { getError } = require('../../index');
            console.log(getError(error, 'Prefix status command'));
          }
        }
      }
      break;
  }
};

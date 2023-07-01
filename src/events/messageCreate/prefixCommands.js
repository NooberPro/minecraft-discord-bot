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
} = require('../../embeds');

module.exports = async (message) => {
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
    case 'motd':
      await message.channel.sendTyping();
      if (commands.prefixCommands.motd) {
        message.channel.send({ embeds: [await motdEmbed()] });
      }
      break;
    case 'ip':
      if (commands.prefixCommands.ip) {
        message.channel.send({ embeds: [ipEmbed] });
      }
      break;
    case 'site':
      if (commands.prefixCommands.ip && config.mcserver.site) {
        message.channel.send({ embeds: [siteEmbed] });
      }
      break;
    case 'version':
      if (commands.prefixCommands.ip) {
        message.channel.send({ embeds: [versionEmbed] });
      }
      break;
    case 'players':
      if (commands.prefixCommands.ip) {
        await message.channel.sendTyping();
        message.channel.send({ embeds: [await playerList()] });
      }
      break;
    case 'status':
      if (commands.prefixCommands.ip) {
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

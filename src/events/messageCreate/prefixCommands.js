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

  if (content === 'help' || (commands.help.alias.includes(content) && commands.help.prefixEnable)) {
    message.channel.send({ embeds: [helpEmbed(client)] });
  }
  if (content === 'motd' || (commands.motd.alias.includes(content) && commands.motd.prefixEnable)) {
    await message.channel.sendTyping();
    message.channel.send({ embeds: [await motdEmbed()] });
  }
  if (content === 'ip' || (commands.ip.alias.includes(content) && commands.ip.prefixEnable)) {
    message.channel.send({ embeds: [ipEmbed] });
  }
  if (
    (content === 'site' || commands.site.alias.includes(content)) &&
    commands.site.prefixEnable &&
    config.mcserver.site
  ) {
    message.channel.send({ embeds: [siteEmbed] });
  }
  if (content === 'version' || (commands.version.alias.includes(content) && commands.version.prefixEnable)) {
    message.channel.send({ embeds: [versionEmbed] });
  }

  if (content === 'players' || (commands.players.alias.includes(content) && commands.players.prefixEnable)) {
    await message.channel.sendTyping();
    message.channel.send({ embeds: [await playerList()] });
  }
  if (content === 'status' || (commands.status.alias.includes(content) && commands.status.prefixEnable)) {
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
};

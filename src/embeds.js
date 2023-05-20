const { EmbedBuilder } = require('discord.js');
const { mcserver, settings } = require('../config');
const icon = mcserver.icon;
const ipBedrock = `IP: \`${mcserver.ip}\`\nPort: \`${mcserver.port}\``;
const port = mcserver.port === 25565 ? '' : `:\`${mcserver.port}\``;
const ipJava = `**IP: \`${mcserver.ip}\`${port}**`;
const ip = mcserver.type === 'bedrock' ? ipBedrock : ipJava;

// Embed Message for site commands
const siteEmbed = new EmbedBuilder()
  .setColor('Aqua')
  .setAuthor({
    name: mcserver.name,
    iconURL: icon,
  })
  .addFields({
    name: '__**WEBSITE**__',
    value: `**Link: ${mcserver.site}**`,
  });

// Embed Message for version commands
const versionEmbed = new EmbedBuilder()
  .setColor('Aqua')
  .setAuthor({
    name: mcserver.name,
    iconURL: icon,
  })
  .addFields({
    name: '__**VERSION**__',
    value: `**${
      mcserver.type.charAt(0).toUpperCase() + mcserver.type.slice(1)
    }: ${mcserver.version}**`,
  });

// Embed Message for ip commands
const ipEmbed = new EmbedBuilder()
  .setColor('Aqua')
  .setAuthor({
    name: mcserver.name,
    iconURL: icon,
  })
  .addFields({
    name: '__**SERVER ADDRESS**__',
    value: `**${ip}**`,
  });

// Embed Message for players commands
const playerList = async () => {
  const { getServerData } = require('./index');
  try {
    const { data, playerList } = await getServerData();
    return new EmbedBuilder()
      .setColor('Aqua')
      .setAuthor({
        name: mcserver.name,
        iconURL: icon,
      })
      .addFields({
        name: '__**PLAYERS**__',
        value: `**${data.players.online}**/**${data.players.max}**${playerList}`,
      });
  } catch (error) {
    if (!settings.logging.errorLog) return;
    console.error(
      chalk.red(`An error with player command:`),
      chalk.keyword('orange')(error.message)
    );
  }
};
// Online Embed Message for status commands
const OnlineEmbed = async (data, playerlist) => {
  return new EmbedBuilder()
    .setColor('Green')
    .setTitle(':green_circle: ONLINE')
    .setAuthor({
      name: mcserver.name,
      iconURL: mcserver.icon,
    })
    .addFields(
      {
        name: '__**PLAYERS**__',
        value: `**${data.players.online}**/**${data.players.max}**${playerlist}`,
      },
      {
        name: '__**MOTD**__',
        value: `**${data.motd.clean}**`,
      },
      {
        name: '__**SERVER ADDRESS**__',
        value: `**${ip}**`,
      },
      {
        name: '__**VERSION**__',
        value: `**${mcserver.version}**`,
      }
    )
    .setTimestamp()
    .setFooter({ text: `Updated at ` });
};
// Offline Embed Message status commands
const offlineStatus = new EmbedBuilder()
  .setColor('Red')
  .setTitle(':red_circle: OFFLINE')
  .setAuthor({
    name: mcserver.name,
    iconURL: mcserver.icon,
  })
  .setTimestamp()
  .setFooter({ text: 'Updated at' });

module.exports = {
  versionEmbed,
  siteEmbed,
  offlineStatus,
  ipEmbed,
  ip,
  playerList,
  OnlineEmbed,
};

const { EmbedBuilder } = require('discord.js');
const { mcserver } = require('../config');
const icon = mcserver.icon;
const ipBedrock = `IP: \`${mcserver.ip}\`\nPort: \`${mcserver.port}\``;
const port = mcserver.port === 25565 ? '' : `:\`${mcserver.port}\``;
const ipJava = `**IP: \`${mcserver.ip}\`${port}**`;
const ip = mcserver.type === 'bedrock' ? ipBedrock : ipJava;

// Embed Message for site commands
const siteEmbed = new EmbedBuilder()
  .setColor('Aqua')
  .setThumbnail(icon)
  .setAuthor({
    name: mcserver.name,
  })
  .addFields({
    name: '__**WEBSITE**__',
    value: `**Link: ${mcserver.site}**`,
  });

// Embed Message for version commands
const versionEmbed = new EmbedBuilder()
  .setColor('Aqua')
  .setThumbnail(icon)
  .setAuthor({
    name: mcserver.name,
  })
  .addFields({
    name: '__**VERSION**__',
    value: `**${mcserver.version}**`,
  });

// Embed Message for ip commands
const ipEmbed = new EmbedBuilder()
  .setColor('Aqua')
  .setThumbnail(icon)
  .setAuthor({
    name: mcserver.name,
  })
  .addFields({
    name: '__**SERVER ADDRESS**__',
    value: `**${ip}**`,
  });
// Offline Embed Message status commands
const offlineStatus = new EmbedBuilder()
  .setColor('Red')
  .setTitle(':red_circle: OFFLINE')
  .setThumbnail(icon)
  .setAuthor({
    name: mcserver.name,
  })
  .setTimestamp()
  .setFooter({ text: 'Checked at' });

// MOTD Embed for motd commands
const motdEmbed = async () => {
  const { getServerDataOnly } = require('./index');
  const { data, isOnline } = await getServerDataOnly();
  if (!isOnline) {
    return offlineStatus;
  } else {
    return new EmbedBuilder()
      .setColor('Aqua')
      .setThumbnail(icon)
      .setAuthor({
        name: mcserver.name,
      })
      .addFields({
        name: '__**MOTD**__',
        value: `**${data.motd.clean}**`,
      });
  }
};
// Embed Message for players commands
const playerList = async () => {
  try {
    const { getServerDataAndPlayerList } = require('./index');
    const { playerListArray, isOnline } = await getServerDataAndPlayerList();
    if (!isOnline) {
      return offlineStatus;
    } else {
      return new EmbedBuilder()
        .setColor('Aqua')
        .setThumbnail(icon)
        .setAuthor({
          name: mcserver.name,
        })
        .addFields(playerListArray);
    }
  } catch (error) {
    const { getError } = require('./index');
    console.log(getError(error, 'Player command Embed'));
  }
};

// Online Embed Message for status commands
const statusEmbed = async () => {
  const { getServerDataAndPlayerList } = require('./index');
  const { data, playerListArray, isOnline } =
    await getServerDataAndPlayerList();
  if (isOnline) {
    return await OnlineEmbed(data, playerListArray);
  } else {
    return offlineStatus;
  }
};

// Online Embed Message for status commands
const OnlineEmbed = async (data, playerlist) => {
  return new EmbedBuilder()
    .setColor('Green')
    .setTitle(':green_circle: ONLINE')
    .setThumbnail(mcserver.icon)
    .setAuthor({
      name: mcserver.name,
    })
    .addFields(playerlist)
    .addFields(
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
module.exports = {
  versionEmbed,
  siteEmbed,
  offlineStatus,
  ipEmbed,
  ip,
  playerList,
  statusEmbed,
  OnlineEmbed,
  motdEmbed,
};

const { EmbedBuilder } = require('discord.js');
const { mcserver, settings, commands } = require('../config');
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
  .setTitle(commands.site.embed.title)
  .setDescription(commands.site.embed.description.replace(/\{site\}/gi, mcserver.site));

// Embed Message for version commands
const versionEmbed = new EmbedBuilder()
  .setColor('Aqua')
  .setThumbnail(icon)
  .setAuthor({
    name: mcserver.name,
  })
  .setTitle(commands.version.embed.title)
  .setDescription(commands.version.embed.description.replace(/\{version\}/gi, mcserver.version));

// Embed Message for ip commands
const ipEmbed = new EmbedBuilder()
  .setColor('Aqua')
  .setThumbnail(icon)
  .setAuthor({
    name: mcserver.name,
  })
  .setTitle(commands.ip.embed.title)
  .setDescription(commands.ip.embed.description.replace(/\{ip\}/gi, ip));

// Offline Embed Message status commands
const offlineStatus = () => {
  const offlineEmbed = new EmbedBuilder()
    .setColor('Red')
    .setTitle(commands.offlineEmbed.title)
    .setThumbnail(icon)
    .setAuthor({
      name: mcserver.name,
    })
    .setTimestamp()
    .setFooter({ text: 'Checked at' });
  if (commands.offlineEmbed.description) {
    offlineEmbed.setDescription(commands.offlineEmbed.description);
  }
  return offlineEmbed;
};

// MOTD Embed for motd commands
const motdEmbed = async () => {
  const { getServerDataOnly } = require('./index');
  const { data, isOnline } = await getServerDataOnly();
  if (!isOnline) {
    return offlineStatus();
  } else {
    return new EmbedBuilder()
      .setColor('Aqua')
      .setThumbnail(icon)
      .setAuthor({
        name: mcserver.name,
      })
      .setTitle(commands.motd.embed.title)
      .setDescription(commands.motd.embed.description.replace(/\{motd\}/gi, data.motd.clean))
      .setFooter({ text: 'Checked at' })
      .setTimestamp();
  }
};
// Embed Message for players commands
const playerList = async () => {
  try {
    const { getServerDataAndPlayerList } = require('./index');
    const { playerListArray, isOnline } = await getServerDataAndPlayerList();
    if (!isOnline) {
      return offlineStatus();
    } else {
      return new EmbedBuilder()
        .setColor('Aqua')
        .setThumbnail(icon)
        .setAuthor({
          name: mcserver.name,
        })
        .addFields(playerListArray)
        .setTimestamp()
        .setFooter({ text: 'Checked at' });
    }
  } catch (error) {
    if (settings.logging.error) {
      const { getError } = require('./index');
      console.log(getError(error, 'Player command Embed'));
    }
  }
};

// Online Embed Message for status commands
const statusEmbed = async () => {
  const { getServerDataAndPlayerList } = require('./index');
  const { data, playerListArray, isOnline } = await getServerDataAndPlayerList();
  if (isOnline) {
    return await OnlineEmbed(data, playerListArray);
  } else {
    return offlineStatus();
  }
};

// Online Embed Message for status commands
const OnlineEmbed = async (data, playerlist) => {
  let fieldArray = commands.status.onlineEmbed.description.split('\n');
  const fieldArrayReplaced = fieldArray.map((str) =>
    str
      .trim()
      .replace(/\{ip\}/gi, ip)
      .replace(/\{motd\}/gi, data.motd.clean)
      .replace(/\{version\}/gi, mcserver.version)
      .replace(/\{site\}/gi, mcserver.site)
  );
  const splitDescription = Math.ceil(fieldArrayReplaced.length / 2);
  const fieldName = fieldArrayReplaced.slice(0, splitDescription);
  const fieldValue = fieldArrayReplaced.slice(splitDescription);
  return new EmbedBuilder()
    .setColor('Green')
    .setThumbnail(icon)
    .setAuthor({
      name: mcserver.name,
    })
    .setTitle(commands.status.onlineEmbed.title)
    .addFields(playerlist)
    .addFields({
      name: fieldName.join('\n'),
      value: '\u200B' + fieldValue.join('\n'),
    })
    .setTimestamp()
    .setFooter({ text: `Checked at` });
};

const helpEmbed = (client) => {
  return new EmbedBuilder()
    .setTitle(commands.help.embed.title)
    .setColor('Aqua')
    .setAuthor({
      name: client.user.username,
      iconURL: client.user.avatarURL(),
    })
    .setDescription(commands.help.embed.description.replace(/\{prefix\}/gi, commands.prefixCommands.prefix));
};

const botInfoEmbed = async (interaction, client) => {
  const process = require('node:process');
  const reply = await interaction.fetchReply();
  const ping = reply.createdTimestamp - interaction.createdTimestamp;
  const os = require('os');
  const cpuUsage = (os.loadavg()[0] / os.cpus().length).toFixed(2);
  const memoryUsage = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
  const nodeVersion = process.version;
  const uptimeSeconds = Math.floor(process.uptime());
  const uptimeMinutes = Math.floor(uptimeSeconds / 60) % 60;
  const uptimeHours = Math.floor(uptimeMinutes / 60) % 24;
  const uptimeDays = Math.floor(uptimeHours / 24);
  return new EmbedBuilder()
    .setAuthor({
      name: client.user.tag,
      iconURL: client.user.avatarURL(),
    })
    .setTitle('**Bot Info and Stats**')
    .setColor('Yellow')
    .setDescription(
      `**CPU Usage: \`${cpuUsage}%\`
      Memory Usage: \`${memoryUsage}MB\`
      Node.js Version: \`${nodeVersion}\`
      Bot uptime: \`${uptimeDays}\` days, \`${uptimeHours}\` hours, \`${uptimeMinutes}\`, minutes, \`${uptimeSeconds}\` seconds
      Ping: Client \`${ping}ms\` | Websocket: \`${client.ws.ping}ms\` **
      `
    );
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
  helpEmbed,
  botInfoEmbed,
};

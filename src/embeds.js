const { EmbedBuilder } = require('discord.js');
const { mcserver, settings, commands } = require('../config');
const icon = mcserver.icon;
const ipBedrock = `IP: \`${mcserver.ip}\`\nPort: \`${mcserver.port}\``;
const port = mcserver.port === 25565 ? '' : `:\`${mcserver.port}\``;
const ipJava = `**IP: \`${mcserver.ip}\`${port}**`;
const ip = mcserver.type === 'bedrock' ? ipBedrock : ipJava;
const fs = require('fs');
const json5 = require('json5');

const fileContents = fs.readFileSync(`./translation/${commands.language}.json5`, 'utf8');
embedReadData = json5.parse(fileContents);

// Embed Message for site commands
const siteEmbed = new EmbedBuilder()
  .setColor('Aqua')
  .setThumbnail(icon)
  .setAuthor({
    name: mcserver.name,
  })
  .setTitle(embedReadData.site.title.replace(/\{site\}/gi, mcserver.site))
  .setDescription(embedReadData.site.description.replace(/\{site\}/gi, mcserver.site));

// Embed Message for version commands
const versionEmbed = new EmbedBuilder()
  .setColor('Aqua')
  .setThumbnail(icon)
  .setAuthor({
    name: mcserver.name,
  })
  .setTitle(embedReadData.version.title.replace(/\{version\}/gi, mcserver.version))
  .setDescription(embedReadData.version.description.replace(/\{version\}/gi, mcserver.version));

// Embed Message for ip commands
const ipEmbed = new EmbedBuilder()
  .setColor('Aqua')
  .setThumbnail(icon)
  .setAuthor({
    name: mcserver.name,
  })
  .setTitle(embedReadData.ip.title.replace(/\{ip\}/gi, ip))
  .setDescription(embedReadData.ip.description.replace(/\{ip\}/gi, ip));

// Offline Embed Message status commands
const offlineStatus = () => {
  const offlineEmbed = new EmbedBuilder()
    .setColor('Red')
    .setTitle(
      embedReadData.offlineEmbed.title
        .replace(/\{ip\}/gi, ip)
        .replace(/\{version\}/gi, mcserver.version)
        .replace(/\{site\}/gi, mcserver.site)
    )
    .setThumbnail(icon)
    .setAuthor({
      name: mcserver.name,
    })
    .setTimestamp()
    .setFooter({ text: 'Checked at' });
  if (embedReadData.offlineEmbed.description) {
    offlineEmbed.setDescription(
      embedReadData.offlineEmbed.description
        .replace(/\{ip\}/gi, ip)
        .replace(/\{version\}/gi, mcserver.version)
        .replace(/\{site\}/gi, mcserver.site)
    );
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
      .setTitle(embedReadData.motd.title.replace(/\{motd\}/gi, data.motd.clean))
      .setDescription(embedReadData.motd.description.replace(/\{motd\}/gi, data.motd.clean))
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
  try {
    let description_field_one = embedReadData.onlineEmbed.description_field_one
      .trim()
      .replace(/\{ip\}/gi, ip)
      .replace(/\{motd\}/gi, data.motd.clean)
      .replace(/\{version\}/gi, mcserver.version)
      .replace(/\{site\}/gi, mcserver.site);
    let description_field_two = embedReadData.onlineEmbed.description_field_two
      .trim()
      .replace(/\{ip\}/gi, ip)
      .replace(/\{motd\}/gi, data.motd.clean)
      .replace(/\{version\}/gi, mcserver.version)
      .replace(/\{site\}/gi, mcserver.site);

    return new EmbedBuilder()
      .setColor('Green')
      .setThumbnail(icon)
      .setAuthor({
        name: mcserver.name,
      })
      .setTitle(
        embedReadData.onlineEmbed.title
          .replace(/\{ip\}/gi, ip)
          .replace(/\{motd\}/gi, data.motd.clean)
          .replace(/\{version\}/gi, mcserver.version)
          .replace(/\{site\}/gi, mcserver.site)
      )
      .addFields(playerlist)
      .addFields({
        name: description_field_one,
        value: description_field_two,
      })
      .setTimestamp()
      .setFooter({ text: `Checked at` });
  } catch (error) {
    console.log(error);
  }
};

const helpEmbed = async (client) => {
  const commandsFetch = await client.application.commands.fetch();
  visibleCmdsNames = [];
  // Get the commands enabled from config and add to visibleCmdsNames
  for (const cmds in commands) {
    if (commands[cmds].enabled) {
      visibleCmdsNames.push(cmds);
    }
  }
  const cmdsList = [];

  // If commands in fetched data is in the config and enabled then it will show in embed
  commandsFetch.forEach((command) => {
    if (visibleCmdsNames.includes(command.name)) {
      cmdsList.push(
        embedReadData.help.listFormat
          .replace(/\{slashCmdMention\}/gi, `</${command.name}:${command.id}>`)
          .replace(/\{cmdDescription\}/gi, command.description)
      );
    }
  });

  return new EmbedBuilder()
    .setTitle(embedReadData.help.title.replace(/\{prefix\}/gi).replace(/\{botName\}/gi, client.user.username))
    .setColor('Yellow')
    .setAuthor({
      name: client.user.username,
      iconURL: client.user.avatarURL(),
    })
    .setDescription(
      `${embedReadData.help.description
        .replace(/\{prefix\}/gi, commands.prefixCommands.prefix)
        .replace(/\{botName\}/gi, client.user.username)}\n${cmdsList.join('\n')}`
    );
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

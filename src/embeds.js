const { EmbedBuilder } = require('discord.js');
const { mcserver } = require('../config');
// Embed Message for /site
const siteEmbed = new EmbedBuilder()
  .setColor('Aqua')
  .setAuthor({
    name: mcserver.name,
    iconURL: `https://api.mcstatus.io/v2/icon/${mcserver.ip}:${mcserver.port}`,
  })
  .addFields({
    name: '__**WEBSITE**__',
    value: `**Link: ${mcserver.site}**`,
  });

const versionEmbed = new EmbedBuilder()
  .setColor('Aqua')
  .setAuthor({
    name: mcserver.name,
    iconURL: `https://api.mcstatus.io/v2/icon/${mcserver.ip}:${mcserver.port}`,
  })
  .addFields({
    name: '__**VERSION**__',
    value: `**${
      mcserver.type.charAt(0).toUpperCase() + mcserver.type.slice(1)
    }: ${mcserver.version}**`,
  });
// Embed Message for /ip command
const ipEmbeds = (type) => {
  if (type === 'bedrock') {
    const { ipBedrock } = require('./index');
    return new EmbedBuilder()
      .setColor('Aqua')
      .setAuthor({
        name: mcserver.name,
        iconURL: `https://api.mcstatus.io/v2/icon/${mcserver.ip}:${mcserver.port}`,
      })
      .addFields({
        name: '__**SERVER ADDRESS**__',
        value: `**${ipBedrock}**`,
      });
  } else {
    const { ipJava } = require('./index');
    return new EmbedBuilder()
      .setColor('Aqua')
      .setAuthor({
        name: mcserver.name,
        iconURL: `https://api.mcstatus.io/v2/icon/${mcserver.ip}:${mcserver.port}`,
      })
      .addFields({
        name: '__**SERVER ADDRESS**__',
        value: `**${ipJava}**`,
      });
  }
};
const playerList = (type) => {
  if (type === 'bedrock') {
    const { bedrockData } = require('./index');
    return new EmbedBuilder()
      .setColor('Aqua')
      .setAuthor({
        name: mcserver.name,
        iconURL: `https://api.mcstatus.io/v2/icon/${mcserver.ip}:${mcserver.port}`,
      })
      .addFields({
        name: '__**PLAYERS**__',
        value: `**${bedrockData.players.online}**/**${bedrockData.players.max}**`,
      });
  } else {
    const { playerList, javaData } = require('./index');
    return new EmbedBuilder()
      .setColor('Aqua')
      .setAuthor({
        name: mcserver.name,
        iconURL: `https://api.mcstatus.io/v2/icon/${mcserver.ip}:${mcserver.port}`,
      })
      .addFields({
        name: '__**PLAYERS**__',
        value: `**${javaData.players.online}**/**${javaData.players.max}**${playerList}`,
      });
  }
};
module.exports = {
  versionEmbed,
  siteEmbed,
  playerList,
  ipEmbeds,
};

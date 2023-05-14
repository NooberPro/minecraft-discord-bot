const { EmbedBuilder } = require('discord.js');
const { mcserver } = require('../config');
// Embed Message for /ip command
const ipEmbed = new EmbedBuilder()
  .setColor('Aqua')
  .setAuthor({
    name: mcserver.name,
    iconURL: `https://api.mcstatus.io/v2/icon/${mcserver.ip}:${mcserver.port}`,
  })
  .addFields({
    name: '__**SERVER ADDRESS**__',
    value: `**IP: \`${mcserver.ip}\`\nPort: \`${mcserver.port}\`**`,
  });

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
    value: `**${mcserver.type.toUpperCase()} ${mcserver.version}**`,
  });

module.exports = {
  ipEmbed,
  versionEmbed,
  siteEmbed,
};

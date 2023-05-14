const { SlashCommandBuilder } = require('discord.js');
const { versionEmbed } = require('../embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('version')
    .setDescription('Sends the current version of the Minecraft Server.'),

  run: ({ interaction }) => {
    interaction.reply({ embeds: [versionEmbed] });
  },

  // deleted: true, // Deletes the command from Discord
};

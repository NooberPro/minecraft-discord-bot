const { SlashCommandBuilder } = require('discord.js');
const { versionEmbed } = require('../embeds');
const { commands } = require('../../config');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('version')
    .setDescription('Sends the version required for the Minecraft Server.'),

  run: ({ interaction }) => {
    interaction.reply({ embeds: [versionEmbed] });
  },
  deleted: !commands.version.slashEnabled || !commands.slashCommands, // Deletes the command from Discord
};

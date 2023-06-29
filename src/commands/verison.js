const { SlashCommandBuilder } = require('discord.js');
const { versionEmbed } = require('../embeds');
const { commands } = require('../../config');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('version')
    .setDescription('Sends the version of the Minecraft Server.'),

  run: ({ interaction }) => {
    interaction.reply({ embeds: [versionEmbed] });
  },
  deleted: !commands.slashCommands.version || !commands.slashCommands.enabled, // Deletes the command from Discord
};

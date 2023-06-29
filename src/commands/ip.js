const { SlashCommandBuilder } = require('discord.js');
const { ipEmbed } = require('../embeds');
const { commands } = require('../../config');
module.exports = {
  data: new SlashCommandBuilder()
    .setName('ip')
    .setDescription('Sends the Server Address of the Minecraft Server.'),
  run: ({ interaction }) => {
    interaction.reply({ embeds: [ipEmbed] });
  },
  deleted: !commands.slashCommands.ip || !commands.slashCommands.enabled, // Deletes the command from Discord
};

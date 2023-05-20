const { SlashCommandBuilder } = require('discord.js');
const { ipEmbed } = require('../embeds');
const { commands } = require('../../config');
module.exports = {
  data: new SlashCommandBuilder()
    .setName('ip')
    .setDescription('Sends the Server Addrees of a Minecraft Server'),
  run: ({ interaction }) => {
    interaction.reply({ embeds: [ipEmbed] });
  },
  deleted: !commands.ip.enableSlash || !commands.slashCommands, // Deletes the command from Discord
};

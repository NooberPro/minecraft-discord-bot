const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { ipEmbed } = require('../embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ip')
    .setDescription('Sends the IP of a Minecraft Server'),

  run: ({ interaction }) => {
    interaction.reply({ embeds: [ipEmbed] });
  },

  //   deleted: true, // Deletes the command from Discord
};

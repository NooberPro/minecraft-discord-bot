const { SlashCommandBuilder } = require('discord.js');
const { siteEmbed } = require('../embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('site')
    .setDescription("Sends the Minecraft Server's website link."),

  run: ({ interaction }) => {
    interaction.reply({ embeds: [siteEmbed] });
  },
  // deleted: true, // Deletes the command from Discord
};

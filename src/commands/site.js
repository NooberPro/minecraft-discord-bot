const { SlashCommandBuilder } = require('discord.js');
const { siteEmbed } = require('../embeds');
const { commands } = require('../../config');
module.exports = {
  data: new SlashCommandBuilder()
    .setName('site')
    .setDescription("Sends the Minecraft Server's website link."),

  run: ({ interaction }) => {
    interaction.reply({ embeds: [siteEmbed] });
  },
  deleted: !commands.site.enableSlash || !commands.slashCommands, // Deletes the command from Discord
};

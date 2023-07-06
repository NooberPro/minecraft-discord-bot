const { SlashCommandBuilder } = require('discord.js');
const { helpEmbed } = require('../embeds');
const { commands } = require('../../config');
module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Sends the the List of availabe commands.'),
  run: ({ interaction, client }) => {
    interaction.reply({ embeds: [helpEmbed(client)] });
  },
  deleted: !commands.help.slashEnabled || !commands.slashCommands, // Deletes the command from Discord
};

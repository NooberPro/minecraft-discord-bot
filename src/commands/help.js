const { SlashCommandBuilder } = require('discord.js')
const { helpEmbed } = require('../embeds')
const { commands } = require('../../config')
module.exports = {
  data: new SlashCommandBuilder().setName('help').setDescription('Sends the the list of availabe commands.'),
  run: async ({ interaction, client }) => {
    await interaction.deferReply()
    await interaction.editReply({ embeds: [await helpEmbed(client)] })
  },
  options: {
    guildOnly: true,
    deleted: !commands.help.enabled || !commands.slashCommands, // Deletes the command from Discord
  },
}

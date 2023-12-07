const { SlashCommandBuilder } = require('discord.js')
const { helpEmbed } = require('../embeds')
const { commands } = require('../../config')
const { cmdSlashTranslation } = require('../index')

module.exports = {
  data: new SlashCommandBuilder()
    .setName(cmdSlashTranslation.help.name)
    .setDescription(cmdSlashTranslation.help.description),
  run: async ({ interaction, client }) => {
    await interaction.deferReply()
    await interaction.followUp({ embeds: [await helpEmbed(client)] })
  },
  options: {
    guildOnly: true,
    deleted: !commands.help.enabled || !commands.slashCommands, // Deletes the command from Discord
  },
}

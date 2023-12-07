const { SlashCommandBuilder } = require('discord.js')
const { ipEmbed } = require('../embeds')
const { commands } = require('../../config')
const { cmdSlashTranslation } = require('../index')

module.exports = {
  data: new SlashCommandBuilder()
    .setName(cmdSlashTranslation.ip.name)
    .setDescription(cmdSlashTranslation.ip.description),
  run: ({ interaction }) => {
    interaction.reply({ embeds: [ipEmbed] })
  },
  options: {
    deleted: !commands.ip.enabled || !commands.slashCommands, // Deletes the command from Discord
    guildOnly: true,
  },
}

const { SlashCommandBuilder } = require('discord.js')
const { versionEmbed } = require('../embeds')
const { commands } = require('../../config')
const { cmdSlashTranslation } = require('../index')

module.exports = {
  data: new SlashCommandBuilder()
    .setName(cmdSlashTranslation.version.name)
    .setDescription(cmdSlashTranslation.version.description),

  run: ({ interaction }) => {
    interaction.reply({ embeds: [versionEmbed] })
  },
  options: {
    guildOnly: true,
    deleted: !commands.version.enabled || !commands.slashCommands, // Deletes the command from Discord
  },
}

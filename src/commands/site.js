const { SlashCommandBuilder } = require('discord.js')
const { siteEmbed } = require('../embeds')
const { commands, mcserver } = require('../../config')
const { cmdSlashTranslation } = require('../index')

module.exports = {
  data: new SlashCommandBuilder()
    .setName(cmdSlashTranslation.site.name)
    .setDescription(cmdSlashTranslation.site.description),

  run: ({ interaction }) => {
    interaction.reply({ embeds: [siteEmbed] })
  },
  options: {
    // Deletes the command from Discord
    deleted: !commands.site.enabled || !commands.slashCommands || !mcserver.site,
  },
}

const { SlashCommandBuilder, MessageFlags } = require('discord.js')
const { siteEmbed } = require('../embeds')
const { commands, mcserver } = require('../../config')
const { cmdSlashTranslation, isChannelAllowed } = require('../index')

module.exports = {
  data: new SlashCommandBuilder()
    .setName(cmdSlashTranslation.site.name)
    .setDescription(cmdSlashTranslation.site.description),

  run: ({ interaction }) => {
    if (!isChannelAllowed(interaction.channelId, false)) {
      interaction.reply({
        content: cmdSlashTranslation.disabledChannelMsg,
        flags: MessageFlags.Ephemeral,
      })
      return
    }
    interaction.reply({ embeds: [siteEmbed] })
  },
  options: {
    // Deletes the command from Discord
    deleted: !commands.site.enabled || !commands.slashCommands || !mcserver.site,
  },
}

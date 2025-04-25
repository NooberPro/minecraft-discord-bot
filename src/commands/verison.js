const { SlashCommandBuilder, MessageFlags } = require('discord.js')
const { versionEmbed } = require('../embeds')
const { commands } = require('../../config')
const { cmdSlashTranslation, isChannelAllowed } = require('../index')

module.exports = {
  data: new SlashCommandBuilder()
    .setName(cmdSlashTranslation.version.name)
    .setDescription(cmdSlashTranslation.version.description),

  run: ({ interaction }) => {
    if (!isChannelAllowed(interaction.channelId, false)) {
      interaction.reply({
        content: cmdSlashTranslation.disabledChannelMsg,
        flags: MessageFlags.Ephemeral,
      })
      return
    }
    interaction.reply({ embeds: [versionEmbed] })
  },
  options: {
    deleted: !commands.version.enabled || !commands.slashCommands, // Deletes the command from Discord
  },
}

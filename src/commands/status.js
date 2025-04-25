const { SlashCommandBuilder, MessageFlags } = require('discord.js')
const { statusEmbed } = require('../embeds')
const { commands } = require('../../config')
const { cmdSlashTranslation, isChannelAllowed } = require('../index')

module.exports = {
  data: new SlashCommandBuilder()
    .setName(cmdSlashTranslation.status.name)
    .setDescription(cmdSlashTranslation.status.description),
  run: async ({ interaction }) => {
    if (!isChannelAllowed(interaction.channelId, false)) {
      interaction.reply({
        content: cmdSlashTranslation.disabledChannelMsg,
        flags: MessageFlags.Ephemeral,
      })
      return
    }
    await interaction.deferReply()
    try {
      interaction.editReply({ content: '', embeds: [await statusEmbed()] })
    } catch (error) {
      interaction.followUp({
        content: cmdSlashTranslation.status.errorReply,
      })
      const { getError } = require('../index')
      getError(error, 'statusCmd')
    }
  },
  options: {
    deleted: !commands.status.enabled || !commands.slashCommands, // Deletes the command from Discord
  },
}

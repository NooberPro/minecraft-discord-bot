const { SlashCommandBuilder, MessageFlags } = require('discord.js')
const { motdEmbed } = require('../embeds')
const { commands } = require('../../config')
const { cmdSlashTranslation, isChannelAllowed } = require('../index')

module.exports = {
  data: new SlashCommandBuilder()
    .setName(cmdSlashTranslation.motd.name)
    .setDescription(cmdSlashTranslation.motd.description),

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
      interaction.editReply({ embeds: [await motdEmbed()] })
    } catch (error) {
      interaction.editReply({
        content: cmdSlashTranslation.motd.errorReply,
      })
      const { getError } = require('../index')
      getError(error, 'motdCmd')
    }
  },
  options: {
    deleted: !commands.motd.enabled || !commands.slashCommands, // Deletes the command from Discord
  },
}

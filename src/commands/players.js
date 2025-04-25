const { SlashCommandBuilder, MessageFlags } = require('discord.js')
const { commands } = require('../../config')
const { cmdSlashTranslation, isChannelAllowed } = require('../index')

module.exports = {
  data: new SlashCommandBuilder()
    .setName(cmdSlashTranslation.players.name)
    .setDescription(cmdSlashTranslation.players.description),
  run: async ({ interaction }) => {
    if (!isChannelAllowed(interaction.channelId, false)) {
      interaction.reply({
        content: cmdSlashTranslation.disabledChannelMsg,
        flags: MessageFlags.Ephemeral,
      })
      return
    }
    await interaction.deferReply()
    const { playerList } = require('../embeds')
    try {
      interaction.editReply({ content: '', embeds: [await playerList()] })
    } catch (error) {
      interaction.followUp({ content: cmdSlashTranslation.players.errorReply })
      const { getError } = require('../index')
      getError(error, 'playerCmd')
    }
  },
  options: {
    deleted: !commands.players.enabled || !commands.slashCommands, // Deletes the command from Discord
  },
}

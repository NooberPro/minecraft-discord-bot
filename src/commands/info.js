const { SlashCommandBuilder, PermissionFlagsBits, MessageFlags } = require('discord.js')
const { botInfoEmbed } = require('../embeds')
const { cmdSlashTranslation } = require('../index')

module.exports = {
  data: new SlashCommandBuilder()
    .setName(cmdSlashTranslation.info.name)
    .setDescription(cmdSlashTranslation.info.description)
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  run: async ({ interaction, client }) => {
    await interaction.deferReply({ flags: MessageFlags.Ephemeral })
    try {
      await interaction.editReply({
        flags: MessageFlags.Ephemeral,
        embeds: [await botInfoEmbed(interaction, client)],
      })
    } catch (error) {
      await interaction.followUp({
        content: cmdSlashTranslation.info.errorReply,
        flags: MessageFlags.Ephemeral,
      })
      const { getError } = require('../index')
      getError(error, 'infoCmd')
    }
  },
  options: {
    deleted: false, // Deletes the command from Discord
  },
}

const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js')
const { botInfoEmbed } = require('../embeds')
const { cmdSlashTranslation } = require('../index')

module.exports = {
  data: new SlashCommandBuilder()
    .setName(cmdSlashTranslation.info.name)
    .setDescription(cmdSlashTranslation.info.description)
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  run: async ({ interaction, client }) => {
    await interaction.deferReply({ ephemeral: true })
    try {
      await interaction.editReply({
        ephemeral: true,
        embeds: [await botInfoEmbed(interaction, client)],
      })
    } catch (error) {
      await interaction.followUp({
        content: cmdSlashTranslation.info.errorReply,
        ephemeral: true,
      })
      const { getError } = require('../index')
      getError(error, 'infoCmd')
      console.log(error)
    }
  },
  options: {
    deleted: false, // Deletes the command from Discord
  },
}

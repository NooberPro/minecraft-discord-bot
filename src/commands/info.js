const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js')
const { botInfoEmbed } = require('../embeds')
const { cmdSlashTranslation } = require('../index')

module.exports = {
  data: new SlashCommandBuilder()
    .setName(cmdSlashTranslation.info.name)
    .setDescription(cmdSlashTranslation.info.description)
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  run: async ({ interaction, client }) => {
    interaction.deferReply({
      ephemeral: true,
    })
    try {
      await interaction.followUp({
        ephemeral: true,
        embeds: [await botInfoEmbed(interaction, client)],
      })
    } catch (error) {
      interaction.followUp({
        content: cmdSlashTranslation.info.errorReply,
        ephemeral: true,
      })
      const { getError } = require('../index')
      getError(error, 'infoCmd')
    }
  },
  options: {
    guildOnly: true,
    deleted: false, // Deletes the command from Discord
  },
}

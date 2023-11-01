const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js')
const { botInfoEmbed } = require('../embeds')
module.exports = {
  data: new SlashCommandBuilder()
    .setName('info')
    .setDescription('Sends the current info about the bot.')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  run: async ({ interaction, client }) => {
    interaction.deferReply({
      ephemeral: true,
    })
    try {
      await interaction.editReply({
        ephemeral: true,
        embeds: [await botInfoEmbed(interaction, client)],
      })
    } catch (error) {
      interaction.editReply({
        content: 'Error with getting Info',
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

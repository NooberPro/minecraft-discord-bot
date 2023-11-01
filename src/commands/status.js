const { SlashCommandBuilder } = require('discord.js')
const { commands, settings } = require('../../config')

module.exports = {
  data: new SlashCommandBuilder().setName('status').setDescription('Sends the current status of the Minecraft Server.'),
  run: async ({ interaction }) => {
    await interaction.deferReply()
    try {
      const { statusEmbed } = require('../embeds')
      interaction.editReply({ content: '', embeds: [await statusEmbed()] })
    } catch (error) {
      interaction.editReply({
        content: 'Error getting the status of the server',
      })
      const { getError } = require('../index')
      getError(error, 'statusCmd')
    }
  },
  options: {
    guildOnly: true,
    deleted: !commands.status.enabled || !commands.slashCommands, // Deletes the command from Discord
  },
}

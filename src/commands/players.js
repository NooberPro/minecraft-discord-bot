const { SlashCommandBuilder } = require('discord.js')
const { commands } = require('../../config')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('players')
    .setDescription('Sends the list of online player in the Minecraft Server.'),
  run: async ({ interaction }) => {
    await interaction.deferReply()
    const { playerList } = require('../embeds')
    try {
      interaction.editReply({ content: '', embeds: [await playerList()] })
    } catch (error) {
      interaction.editReply({ content: 'Error with getting Players' })
      const { getError } = require('../index')
      getError(error, 'playerCmd')
    }
  },
  options: {
    guildOnly: true,
    deleted: !commands.players.enabled || !commands.slashCommands, // Deletes the command from Discord
  },
}

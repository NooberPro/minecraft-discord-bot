const { SlashCommandBuilder } = require('discord.js');
const { commands, settings } = require('../../config');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('players')
    .setDescription('Sends the online player details.'),
  run: async ({ interaction }) => {
    await interaction.deferReply();
    const { playerList } = require('../embeds');
    try {
      interaction.editReply({ content: '', embeds: [await playerList()] });
    } catch (error) {
      interaction.editReply({ content: 'Error with getting Players' });
      if (settings.logging.error) {
        const { getError } = require('../index');
        console.log(getError(error, 'Slash command - Player'));
      }
    }
  },
  deleted: !commands.slashCommands.players || !commands.slashCommands.enabled, // Deletes the command from Discord
};

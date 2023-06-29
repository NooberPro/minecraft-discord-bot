const { SlashCommandBuilder } = require('discord.js');
const { commands } = require('../../config');

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
      const { getError } = require('../index');
      console.log(getError(error, 'Slash command - Player'));
    }
  },
  deleted: !commands.slashCommands.players || !commands.slashCommands.enabled, // Deletes the command from Discord
};

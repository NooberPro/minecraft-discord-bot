const { SlashCommandBuilder } = require('discord.js');
const { commands, settings } = require('../../config');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('players')
    .setDescription('Sends the list of online player in the Minecraft Server.'),
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
  options: {
    deleted: !commands.players.slashEnabled || !commands.slashCommands, // Deletes the command from Discord
  },
};

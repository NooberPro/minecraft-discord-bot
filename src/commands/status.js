const { SlashCommandBuilder } = require('discord.js');
const { commands, settings } = require('../../config');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('status')
    .setDescription('Sends the Status of the Minecraft Server.'),
  run: async ({ interaction }) => {
    await interaction.deferReply();
    try {
      const { statusEmbed } = require('../embeds');
      interaction.editReply({ content: '', embeds: [await statusEmbed()] });
    } catch (error) {
      interaction.editReply({
        content: 'Error getting the status of the server',
      });
      if (settings.logging.error) {
        const { getError } = require('../index');
        console.log(getError(error, 'Slash command - Status'));
      }
    }
  },
  deleted: !commands.slashCommands.status || !commands.slashCommands.enabled, // Deletes the command from Discord
};

const { SlashCommandBuilder } = require('discord.js');
const { settings, commands } = require('../../config');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('players')
    .setDescription('Sends the Player Online List.'),
  run: async ({ interaction }) => {
    await interaction.channel.sendTyping();
    const { playerList } = require('../embeds');
    try {
      const playerEmbed = await playerList();
      interaction.reply({ embeds: [playerEmbed] });
    } catch (error) {
      if (!settings.logging.errorLog) return;
      console.error(
        chalk.red(`Error with player command: `),
        chalk.keyword('orange')(error.message)
      );
    }
  },
  deleted: !commands.players.enableSlash || !commands.slashCommands, // Deletes the command from Discord
};

const { SlashCommandBuilder } = require('discord.js');
const { mcserver, settings } = require('../../config');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('players')
    .setDescription('Sends the Player Online List.'),
  run: ({ interaction }) => {
    try {
      if (mcserver.type === 'bedrock') {
        const { playerList } = require('../embeds');
        const playerListsBeddrock = playerList('bedrock');
        interaction.reply({ embeds: [playerListsBeddrock] });
      } else {
        const { playerList } = require('../embeds');
        const playerListsJava = playerList('java');
        interaction.reply({ embeds: [playerListsJava] });
      }
    } catch (error) {
      if (!settings.logging.errorLog) return;
      console.error(
        chalk.red(`Error with player command: `),
        chalk.keyword('orange')(error.message)
      );
    }
  },
  //   deleted: true, // Deletes the command from Discord
};

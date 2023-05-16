const { SlashCommandBuilder } = require('discord.js');
const { mcserver, settings } = require('../../config');
module.exports = {
  data: new SlashCommandBuilder()
    .setName('status')
    .setDescription('Sends the Status of Minecraft Server.'),
  run: ({ interaction }) => {
    try {
      if (mcserver.type === 'bedrock') {
        const { onlineEmbedBedrock } = require('../index');
        interaction.reply({ embeds: [onlineEmbedBedrock] });
      } else {
        const { onlineJava } = require('../index');
        interaction.reply({ embeds: [onlineJava] });
      }
    } catch (error) {
      if (!settings.logging.errorLog) return;
      console.error(
        chalk.red(`Error with status command: `),
        chalk.keyword('orange')(error.message)
      );
    }
  },
  //   deleted: true, // Deletes the command from Discord
};

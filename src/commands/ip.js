const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { mcserver, settings } = require('../../config');
const chalk = require('chalk');
module.exports = {
  data: new SlashCommandBuilder()
    .setName('ip')
    .setDescription('Sends the IP of a Minecraft Server'),

  run: ({ interaction }) => {
    try {
      if (mcserver.type === 'bedrock') {
        const { ipEmbeds } = require('../embeds');
        const ipEmbed = ipEmbeds('bedrock');
        interaction.reply({ embeds: [ipEmbed] });
      } else {
        const { ipEmbeds } = require('../embeds');
        const ipEmbed = ipEmbeds('java');
        interaction.reply({ embeds: [ipEmbed] });
      }
    } catch (error) {
      if (!settings.logging.errorLog) return;
      console.error(
        chalk.red(`Error with ip command:`),
        chalk.keyword('orange')(error.message)
      );
    }
  },
  //   deleted: true, // Deletes the command from Discord
};

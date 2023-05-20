const { SlashCommandBuilder } = require('discord.js');
const { settings, commands } = require('../../config');
const { OnlineEmbed, offlineStatus } = require('../embeds');
const { getServerData } = require('../index');
const chalk = require('chalk');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('status')
    .setDescription('Sends the Status of Minecraft Server.'),
  run: async ({ interaction }) => {
    await interaction.channel.sendTyping();
    try {
      const { data, playerList } = await getServerData();
      if (!data.online) {
        interaction.reply({ embeds: [offlineStatus] });
      } else {
        const onlineEmbed = await OnlineEmbed(data, playerList);
        interaction.reply({ embeds: [onlineEmbed] });
      }
    } catch (error) {
      if (!settings.logging.errorLog) return;
      console.error(
        chalk.red(`An error with status command:`),
        chalk.keyword('orange')(error.message)
      );
    }
  },
  deleted: !commands.status.enableSlash || !commands.slashCommands, // Deletes the command from Discord
};

const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { botInfoEmbed } = require('../embeds');
module.exports = {
  data: new SlashCommandBuilder()
    .setName('botinfo')
    .setDescription('Sends the CPU, Memory Stats of the Bot.')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  run: async ({ interaction, client }) => {
    interaction.deferReply({
      ephemeral: true,
    });
    try {
      await interaction.editReply({
        ephemeral: true,
        embeds: [await botInfoEmbed(interaction, client)],
      });
    } catch (error) {
      interaction.editReply({
        content: 'Error with getting Bot Info',
        ephemeral: true,
      });
      const { settings } = require('../../config');
      if (settings.logging.error) {
        const { getError } = require('../index');
        console.log(getError(error, 'Slash command - Botinfo'));
      }
    }
  },
};

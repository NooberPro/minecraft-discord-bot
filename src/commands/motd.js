const { SlashCommandBuilder } = require('discord.js')
const { motdEmbed } = require('../embeds')
const { commands } = require('../../config')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('motd')
    .setDescription("Sends the Minecraft Server's Message Of The Day (MOTD)."),

  run: async ({ interaction }) => {
    interaction.deferReply()
    try {
      interaction.editReply({ embeds: [await motdEmbed()] })
    } catch (error) {
      interaction.editReply({
        content: 'Error with getting Message of the Day (MOTD)',
      })
      const { getError } = require('../index')
      getError(error, 'motdCmd')
    }
  },
  options: {
    guildOnly: true,
    deleted: !commands.motd.enabled || !commands.slashCommands, // Deletes the command from Discord
  },
}

const { SlashCommandBuilder } = require('discord.js')
const { ipEmbed } = require('../embeds')
const { commands } = require('../../config')
module.exports = {
  data: new SlashCommandBuilder().setName('ip').setDescription('Sends the Server Address of the Minecraft Server.'),
  run: ({ interaction }) => {
    interaction.reply({ embeds: [ipEmbed] })
  },
  options: {
    deleted: !commands.ip.enabled || !commands.slashCommands, // Deletes the command from Discord
    guildOnly: true,
  },
}

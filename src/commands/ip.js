const { SlashCommandBuilder, MessageFlags } = require('discord.js')
const { ipEmbed } = require('../embeds')
const { commands } = require('../../config')
const { cmdSlashTranslation, isChannelAllowed } = require('../index')

module.exports = {
  data: new SlashCommandBuilder()
    .setName(cmdSlashTranslation.ip.name)
    .setDescription(cmdSlashTranslation.ip.description),
  run: ({ interaction }) => {
    if (!isChannelAllowed(interaction.channelId, false)) {
      interaction.reply({
        content: cmdSlashTranslation.disabledChannelMsg,
        flags: MessageFlags.Ephemeral,
      })
      return
    }
    interaction.reply({ embeds: [ipEmbed] })
  },
  options: {
    deleted: !commands.ip.enabled || !commands.slashCommands, // Deletes the command from Discord
  },
}

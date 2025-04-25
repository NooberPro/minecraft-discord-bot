const { SlashCommandBuilder } = require('discord.js')
const { helpEmbed } = require('../embeds')
const { commands } = require('../../config')
const { cmdSlashTranslation, isChannelAllowed } = require('../index')

const commandsChoicesArray = []
for (const cmds in commands) {
  if (
    commands[cmds].enabled &&
    !['disabledChannels', 'enabledChannels', 'slashCommands', 'prefixCommands', 'language'].includes(cmds)
  ) {
    commandsChoicesArray.push({ name: cmds, value: cmds })
  }
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName(cmdSlashTranslation.help.name)
    .setDescription(cmdSlashTranslation.help.description)
    .addStringOption((option) =>
      option
        .setName(cmdSlashTranslation.help.options.name)
        .setDescription(cmdSlashTranslation.help.options.description)
        .addChoices(...commandsChoicesArray)
    ),
  run: async ({ interaction, client }) => {
    if (!isChannelAllowed(interaction.channelId, false)) {
      interaction.reply({
        content: cmdSlashTranslation.disabledChannelMsg,
        flags: MessageFlags.Ephemeral,
      })
      return
    }
    await interaction.deferReply()
    const commandsChoice = await interaction.options.getString(cmdSlashTranslation.help.options.name)
    await interaction.editReply({ embeds: [await helpEmbed(client, commandsChoice)] })
  },
  options: {
    deleted: !commands.help.enabled || !commands.slashCommands, // Deletes the command from Discord
  },
}

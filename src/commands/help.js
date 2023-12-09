const { SlashCommandBuilder } = require('discord.js')
const { helpEmbed } = require('../embeds')
const { commands } = require('../../config')
const { cmdSlashTranslation } = require('../index')

const commandsChoicesArray = []
for (const cmds in commands) {
  if (commands[cmds].enabled && !['slashCommands', 'prefixCommands', 'language'].includes(cmds)) {
    commandsChoicesArray.push({ name: cmds, value: cmds })
  }
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName(cmdSlashTranslation.help.name)
    .setDescription(cmdSlashTranslation.help.description)
    .addStringOption((option) =>
      option
        .setName('commands')
        .setDescription('Show details about a command.')
        .addChoices(...commandsChoicesArray)
    ),
  run: async ({ interaction, client }) => {
    await interaction.deferReply()
    const commandsChoice = interaction.options.getString('commands')
    await interaction.followUp({ embeds: [await helpEmbed(client, commandsChoice)] })
  },
  options: {
    guildOnly: true,
    deleted: !commands.help.enabled || !commands.slashCommands, // Deletes the command from Discord
  },
}

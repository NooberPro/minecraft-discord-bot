const { SlashCommandBuilder } = require('discord.js')
const { statusEmbed } = require('../embeds')
const { commands, settings } = require('../../config')
const json5 = require('json5')
const fs = require('fs')

const cmdSlashLanguage = settings.language.slashCmds ? settings.language.slashCmds : settings.language.main
const fileContents = fs.readFileSync(`./translation/${cmdSlashLanguage}/slash-cmds.json5`, 'utf8')
const cmdSlashRead = json5.parse(fileContents)

module.exports = {
  data: new SlashCommandBuilder().setName(cmdSlashRead.status.name).setDescription(cmdSlashRead.status.description),
  run: async ({ interaction }) => {
    await interaction.deferReply()
    try {
      interaction.followUp({ content: '', embeds: [await statusEmbed()] })
    } catch (error) {
      interaction.followUp({
        content: cmdSlashRead.status.errorReply,
      })
      const { getError } = require('../index')
      getError(error, 'statusCmd')
    }
  },
  options: {
    guildOnly: true,
    deleted: !commands.status.enabled || !commands.slashCommands, // Deletes the command from Discord
  },
}

const { SlashCommandBuilder } = require('discord.js')
const { commands, settings } = require('../../config')
const json5 = require('json5')
const fs = require('fs')

const cmdSlashLanguage = settings.language.slashCmds ? settings.language.slashCmds : settings.language.main
const fileContents = fs.readFileSync(`./translation/${cmdSlashLanguage}/slash-cmds.json5`, 'utf8')
const cmdSlashRead = json5.parse(fileContents)

module.exports = {
  data: new SlashCommandBuilder().setName(cmdSlashRead.players.name).setDescription(cmdSlashRead.players.description),
  run: async ({ interaction }) => {
    await interaction.deferReply()
    const { playerList } = require('../embeds')
    try {
      interaction.followUp({ content: '', embeds: [await playerList()] })
    } catch (error) {
      interaction.followUp({ content: cmdSlashRead.players.errorReply })
      const { getError } = require('../index')
      getError(error, 'playerCmd')
    }
  },
  options: {
    guildOnly: true,
    deleted: !commands.players.enabled || !commands.slashCommands, // Deletes the command from Discord
  },
}

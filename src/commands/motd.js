const { SlashCommandBuilder } = require('discord.js')
const { motdEmbed } = require('../embeds')
const { commands, settings } = require('../../config')

const json5 = require('json5')
const fs = require('fs')

const cmdSlashLanguage = settings.language.slashCmds ? settings.language.slashCmds : settings.language.main
const fileContents = fs.readFileSync(`./translation/${cmdSlashLanguage}/slash-cmds.json5`, 'utf8')
const cmdSlashRead = json5.parse(fileContents)

module.exports = {
  data: new SlashCommandBuilder().setName(cmdSlashRead.motd.name).setDescription(cmdSlashRead.motd.description),

  run: async ({ interaction }) => {
    interaction.deferReply()
    try {
      interaction.followUp({ embeds: [await motdEmbed()] })
    } catch (error) {
      interaction.followUp({
        content: cmdSlashRead.motd.errorReply,
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

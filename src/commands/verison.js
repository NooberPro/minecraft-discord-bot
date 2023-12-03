const { SlashCommandBuilder } = require('discord.js')
const { versionEmbed } = require('../embeds')
const { commands, settings } = require('../../config')
const json5 = require('json5')
const fs = require('fs')

const cmdSlashLanguage = settings.language.slashCmds ? settings.language.slashCmds : settings.language.main
const fileContents = fs.readFileSync(`./translation/${cmdSlashLanguage}/slash-cmds.json5`, 'utf8')
const cmdSlashRead = json5.parse(fileContents)

module.exports = {
  data: new SlashCommandBuilder().setName(cmdSlashRead.version.name).setDescription(cmdSlashRead.version.description),

  run: ({ interaction }) => {
    interaction.reply({ embeds: [versionEmbed] })
  },
  options: {
    guildOnly: true,
    deleted: !commands.version.enabled || !commands.slashCommands, // Deletes the command from Discord
  },
}

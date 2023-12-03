const { SlashCommandBuilder } = require('discord.js')
const { ipEmbed } = require('../embeds')
const { commands, settings } = require('../../config')

const json5 = require('json5')
const fs = require('fs')

const cmdSlashLanguage = settings.language.slashCmds ? settings.language.slashCmds : settings.language.main
const fileContents = fs.readFileSync(`./translation/${cmdSlashLanguage}/slash-cmds.json5`, 'utf8')
const cmdSlashRead = json5.parse(fileContents)

module.exports = {
  data: new SlashCommandBuilder().setName(cmdSlashRead.ip.name).setDescription(cmdSlashRead.ip.description),
  run: ({ interaction }) => {
    interaction.reply({ embeds: [ipEmbed] })
  },
  options: {
    deleted: !commands.ip.enabled || !commands.slashCommands, // Deletes the command from Discord
    guildOnly: true,
  },
}

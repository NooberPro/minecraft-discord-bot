const { SlashCommandBuilder } = require('discord.js')
const { siteEmbed } = require('../embeds')
const { commands, mcserver, settings } = require('../../config')
const json5 = require('json5')
const fs = require('fs')

const cmdSlashLanguage = settings.language.slashCmds ? settings.language.slashCmds : settings.language.main
const fileContents = fs.readFileSync(`./translation/${cmdSlashLanguage}/slash-cmds.json5`, 'utf8')
const cmdSlashRead = json5.parse(fileContents)
module.exports = {
  data: new SlashCommandBuilder().setName(cmdSlashRead.site.name).setDescription(cmdSlashRead.site.description),

  run: ({ interaction }) => {
    interaction.reply({ embeds: [siteEmbed] })
  },
  options: {
    guildOnly: true,
    // Deletes the command from Discord
    deleted: !commands.site.enabled || !commands.slashCommands || !mcserver.site,
  },
}

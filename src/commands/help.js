const { SlashCommandBuilder } = require('discord.js')
const { helpEmbed } = require('../embeds')
const { commands, settings } = require('../../config')
const json5 = require('json5')
const fs = require('fs')

const cmdSlashLanguage = settings.language.slashCmds ? settings.language.slashCmds : settings.language.main
const fileContents = fs.readFileSync(`./translation/${cmdSlashLanguage}/slash-cmds.json5`, 'utf8')
const cmdSlashRead = json5.parse(fileContents)

module.exports = {
  data: new SlashCommandBuilder().setName(cmdSlashRead.help.name).setDescription(cmdSlashRead.help.description),
  run: async ({ interaction, client }) => {
    await interaction.deferReply()
    await interaction.followUp({ embeds: [await helpEmbed(client)] })
  },
  options: {
    guildOnly: true,
    deleted: !commands.help.enabled || !commands.slashCommands, // Deletes the command from Discord
  },
}

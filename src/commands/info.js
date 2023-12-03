const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js')
const { botInfoEmbed } = require('../embeds')
const { settings } = require('../../config')

const json5 = require('json5')
const fs = require('fs')

const cmdSlashLanguage = settings.language.slashCmds ? settings.language.slashCmds : settings.language.main
const fileContents = fs.readFileSync(`./translation/${cmdSlashLanguage}/slash-cmds.json5`, 'utf8')
const cmdSlashRead = json5.parse(fileContents)

module.exports = {
  data: new SlashCommandBuilder()
    .setName(cmdSlashRead.info.name)
    .setDescription(cmdSlashRead.info.description)
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  run: async ({ interaction, client }) => {
    interaction.deferReply({
      ephemeral: true,
    })
    try {
      await interaction.followUp({
        ephemeral: true,
        embeds: [await botInfoEmbed(interaction, client)],
      })
    } catch (error) {
      interaction.followUp({
        content: cmdSlashRead.info.errorReply,
        ephemeral: true,
      })
      const { getError } = require('../index')
      getError(error, 'infoCmd')
    }
  },
  options: {
    guildOnly: true,
    deleted: false, // Deletes the command from Discord
  },
}

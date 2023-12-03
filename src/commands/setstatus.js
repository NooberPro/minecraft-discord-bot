const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js')
const { statusMessageEdit } = require('../index')
const config = require('../../config')
const chalk = require('chalk')
const fs = require('fs')
const json5 = require('json5')

languageConsoleOuput = config.settings.language.consoleLog
  ? config.settings.language.consoleLog
  : config.settings.language.main
const consoleLogData = fs.readFileSync(`./translation/${languageConsoleOuput}/console-log.json5`, 'utf8')
const consoleLog = json5.parse(consoleLogData)

const cmdSlashLanguage = config.settings.language.slashCmds
  ? config.settings.language.slashCmds
  : config.settings.language.main
const fileContents = fs.readFileSync(`./translation/${cmdSlashLanguage}/slash-cmds.json5`, 'utf8')
const cmdSlashRead = json5.parse(fileContents)

module.exports = {
  data: new SlashCommandBuilder()
    .setName(cmdSlashRead.setstatus.name)
    .setDescription(cmdSlashRead.setstatus.description)
    .setDefaultMemberPermissions(
      PermissionFlagsBits.ManageChannels,
      PermissionFlagsBits.ManageThreads,
      PermissionFlagsBits.ModerateMembers
    ),

  run: async ({ interaction, client }) => {
    await interaction.deferReply({ ephemeral: true })
    try {
      if (!config.autoChangeStatus.enabled) {
        interaction.followUp({
          content: cmdSlashRead.setstatus.enableFeature,
          ephemeral: true,
        })
        return
      }
      const channel = client.channels.cache.get(interaction.channelId)
      const msg = await channel.send(cmdSlashRead.setstatus.checkingStatusCmdMsg)
      const readData = fs.readFileSync('./src/data.json', 'utf8')
      data = await JSON.parse(readData)
      data.channelId = interaction.channelId
      data.messageId = msg.id
      fs.writeFileSync('./src/data.json', JSON.stringify(data, null, 2), 'utf8')
      const dataRead = fs.readFileSync('./src/data.json', 'utf8')
      let dataID = JSON.parse(dataRead)
      await statusMessageEdit()
      interaction.followUp({
        content: cmdSlashRead.setstatus.statusMsgSuccess
          .replace(/\{channel\}/gi, `<#${dataID.channelId}>`)
          .replace(
            /\{messageLink\}/gi,
            `https://discord.com/channels/${msg.guildId}/${dataID.channelId}/${dataID.messageId}`
          ),
        ephemeral: true,
      })
      console.log(
        consoleLog.debug.autoChangeStatus.successLog.replace(/\{channelName\}/gi, chalk.cyan(`#${msg.channel.name}`))
      )
      setInterval(() => {
        statusMessageEdit()
      }, config.autoChangeStatus.updateInterval * 1000)
    } catch (error) {
      interaction.followUp({
        content: errorReply.replace(/\{error\}/gi, error.message),
        ephemeral: true,
      })
      const { getError } = require('../index')
      getError(error, 'setStatus')
    }
  },
  options: {
    guildOnly: true,
    deleted: false,
  },
}

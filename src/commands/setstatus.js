const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js')
const { statusMessageEdit, consoleLogTranslation, cmdSlashTranslation } = require('../index')
const config = require('../../config')
const chalk = require('chalk')
const fs = require('fs')

module.exports = {
  data: new SlashCommandBuilder()
    .setName(cmdSlashTranslation.setstatus.name)
    .setDescription(cmdSlashTranslation.setstatus.description)
    .setDefaultMemberPermissions(
      PermissionFlagsBits.ManageChannels,
      PermissionFlagsBits.ManageThreads,
      PermissionFlagsBits.ModerateMembers
    ),

  run: async ({ interaction, client }) => {
    await interaction.deferReply({ ephemeral: true })
    try {
      if (!config.autoChangeStatus.enabled) {
        interaction.editReply({
          content: cmdSlashTranslation.setstatus.enableFeature,
          ephemeral: true,
        })
        return
      }
      const channel = client.channels.cache.get(interaction.channelId)
      const msg = await channel.send(cmdSlashTranslation.setstatus.checkingStatusCmdMsg)
      const readData = fs.readFileSync('./src/data.json', 'utf8')
      data = await JSON.parse(readData)
      data.channelId = interaction.channelId
      data.messageId = msg.id
      fs.writeFileSync('./src/data.json', JSON.stringify(data, null, 2), 'utf8')
      const dataRead = fs.readFileSync('./src/data.json', 'utf8')
      let dataID = JSON.parse(dataRead)
      await statusMessageEdit()
      interaction.editReply({
        content: cmdSlashTranslation.setstatus.statusMsgSuccess
          .replace(/\{channel\}/gi, `<#${dataID.channelId}>`)
          .replace(
            /\{messageLink\}/gi,
            `https://discord.com/channels/${msg.guildId}/${dataID.channelId}/${dataID.messageId}`
          ),
        ephemeral: true,
      })
      console.log(
        consoleLogTranslation.debug.autoChangeStatus.successLog.replace(
          /\{channelName\}/gi,
          chalk.cyan(`#${msg.channel.name}`)
        )
      )
      setInterval(() => {
        statusMessageEdit()
      }, config.autoChangeStatus.updateInterval * 1000)
    } catch (error) {
      interaction.editReply({
        content: cmdSlashTranslation.setstatus.errorReply.replace(/\{error\}/gi, error.message),
        ephemeral: true,
      })
      const { getError } = require('../index')
      getError(error, 'setStatus')
    }
  },
  options: {
    deleted: false,
  },
}

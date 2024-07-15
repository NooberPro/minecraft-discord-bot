const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js')
const { statusMessageEdit, consoleLogTranslation, cmdSlashTranslation, getError } = require('../index')
const { autoChangeStatus, mcserver } = require('../../config')
const chalk = require('chalk')
const fs = require('fs')

let data = new SlashCommandBuilder()
  .setName(cmdSlashTranslation.setstatus.name)
  .setDescription(cmdSlashTranslation.setstatus.description)
  .addStringOption((option) =>
    option.setName('name').setDescription(cmdSlashTranslation.setstatus.serverName).setRequired(true)
  )
  .addStringOption((option) =>
    option.setName('ip').setDescription(cmdSlashTranslation.setstatus.serverIp).setRequired(true)
  )
  .addIntegerOption((option) =>
    option
      .setName('port')
      .setDescription(cmdSlashTranslation.setstatus.serverPort)
      .setRequired(true)
      .setMinValue(1)
      .setMaxValue(65535)
  )
  .addStringOption((option) =>
    option
      .setName('type')
      .setDescription(cmdSlashTranslation.setstatus.serverType)
      .setRequired(true)
      .addChoices({ name: 'Java', value: 'java' }, { name: 'Bedrock', value: 'bedrock' })
  )

if (autoChangeStatus.playerAvatarEmoji.enabled) {
  data.addBooleanOption((option) =>
    option.setName('player_avatar').setDescription(cmdSlashTranslation.setstatus.playerAvatar).setRequired(true)
  )
}
if (autoChangeStatus.adminOnly) {
  data.setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
}

let run = async ({ interaction, client }) => {
  await interaction.deferReply({ ephemeral: true })
  try {
    if (!autoChangeStatus.enabled) {
      interaction.editReply({
        content: cmdSlashTranslation.setstatus.enableFeature,
        ephemeral: true,
      })
      return
    }
    const channel = client.channels.cache.get(interaction.channelId)
    const msg = await channel.send(cmdSlashTranslation.setstatus.checkingStatusCmdMsg)
    const readData = fs.readFileSync('./src/data.json', 'utf8')
    const ip = interaction.options.getString('ip') || mcserver.ip
    const port = interaction.options.getInteger('port') || mcserver.port
    const type = interaction.options.getString('type') || mcserver.type
    const name = interaction.options.getString('name') || mcserver.name

    const playerAvatarEmoji = interaction.options.getBoolean('player_avatar')
    const member = await interaction.guild.members.fetch(interaction.user.id)
    const hasManageChannels = member.permissions.has(PermissionFlagsBits.ManageChannels)
    const isPlayerAvatarEmoji =
      playerAvatarEmoji && hasManageChannels && autoChangeStatus.playerAvatarEmoji.enabled && type === 'java'

    let dataRead = await JSON.parse(readData)

    if (!ip.includes('.')) {
      throw { message: `Invalid IP "${ip}"` }
    }

    dataRead.autoChangeStatus.push({
      ip,
      port,
      type,
      name,
      channelId: interaction.channelId,
      messageId: msg.id,
      isPlayerAvatarEmoji,
    })

    await statusMessageEdit(ip, port, type, name, msg, isPlayerAvatarEmoji)
    fs.writeFileSync('./src/data.json', JSON.stringify(dataRead, null, 2), 'utf8')
    interaction.editReply({
      content: cmdSlashTranslation.setstatus.statusMsgSuccess
        .replace(/\{channel\}/gi, `<#${interaction.channelId}>`)
        .replace(/\{messageLink\}/gi, `https://discord.com/channels/${msg.guildId}/${interaction.channelId}/${msg.id}`),
      ephemeral: true,
    })
    console.log(
      consoleLogTranslation.debug.autoChangeStatus.successLog.replace(
        /\{channelName\}/gi,
        chalk.cyan(`#${msg.channel.name}`)
      )
    )
  } catch (error) {
    interaction.editReply({
      content: cmdSlashTranslation.setstatus.errorReply.replace(/\{error\}/gi, error.message),
      ephemeral: true,
    })
    if (error.message.startsWith('Invalid IP')) return
    getError(error, 'setStatus')
  }
}

module.exports = { data, run }

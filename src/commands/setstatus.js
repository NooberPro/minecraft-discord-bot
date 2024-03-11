const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js')
const { statusMessageEdit, consoleLogTranslation, cmdSlashTranslation, getError } = require('../index')
const config = require('../../config')
const chalk = require('chalk')
const fs = require('fs')

let data = new SlashCommandBuilder()
  .setName(cmdSlashTranslation.setstatus.name)
  .setDescription(cmdSlashTranslation.setstatus.description)
  .addStringOption((option) =>
    option.setName('name').setDescription('Enter the name of your Minecraft server.').setRequired(true)
  )
  .addStringOption((option) =>
    option.setName('ip').setDescription('Enter the IP address of your Minecraft server.').setRequired(true)
  )
  .addIntegerOption((option) =>
    option.setName('port').setDescription('Enter the port number of your Minecraft server.').setRequired(true)
  )
  .addStringOption((option) =>
    option
      .setName('type')
      .setDescription('Choose your server type: Java or Bedrock')
      .setRequired(true)
      .addChoices({ name: 'Java', value: 'java' }, { name: 'Bedrock', value: 'bedrock' })
  )

if (config.autoChangeStatus.adminOnly) {
  data.setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
}

let run = async ({ interaction, client }) => {
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
    const ip = interaction.options.getString('ip')
    const port = interaction.options.getInteger('port')
    const type = interaction.options.getString('type')
    const name = interaction.options.getString('name')
    let dataRead = await JSON.parse(readData)

    if (!ip.includes('.')) {
      await msg.edit({
        content: `**The ip \`${ip}\` entered is invaild.**`,
        embeds: [],
      })
      return
    }
    dataRead.autoChangeStatus.push({
      ip,
      port,
      type,
      name,
      channelId: interaction.channelId,
      messageId: msg.id,
    })
    await statusMessageEdit(ip, port, type, name, msg)
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
    getError(error, 'setStatus')
  }
}

module.exports = { data, run }

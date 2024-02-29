const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js')
const { statusMessageEdit, consoleLogTranslation, cmdSlashTranslation, getError, getPlayersList } = require('../index')
const config = require('../../config')
const chalk = require('chalk')
const fs = require('fs')
const { OnlineEmbed, offlineStatus } = require('../embeds')
const { statusBedrock, statusJava } = require('node-mcstatus')

let data = new SlashCommandBuilder()
  .setName(cmdSlashTranslation.setstatus.name)
  .setDescription(cmdSlashTranslation.setstatus.description)
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
    data = await JSON.parse(readData)
    data.autoChangeStatus.push({
      ip,
      port,
      type,
      channelId: interaction.channelId,
      messageId: msg.id,
    })
    fs.writeFileSync('./src/data.json', JSON.stringify(data, null, 2), 'utf8')
    try {
      const data = type === 'java' ? await statusJava(ip, port) : await statusBedrock(ip, port)
      const isOnline = config.autoChangeStatus.isOnlineCheck ? data.online && data.players.max >= 0 : data.online
      if (isOnline) {
        const playerListArray = await getPlayersList(data.players)
        await msg.edit({
          content: '',
          embeds: [await OnlineEmbed(data, playerListArray)],
        })
      } else {
        await msg.edit({
          content: '',
          embeds: [offlineStatus()],
        })
      }
    } catch (error) {
      if (error.message === 'Bad Request') {
        await msg.edit({
          content: `**The ip \`${ip}\` entered is invaild.**`,
          embeds: [],
        })
        return
      }
      getError(error, 'fetchServerDataAndPlayerList')
    }
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
    setInterval(() => {
      statusMessageEdit()
    }, config.autoChangeStatus.updateInterval * 1000)
  } catch (error) {
    interaction.editReply({
      content: cmdSlashTranslation.setstatus.errorReply.replace(/\{error\}/gi, error.message),
      ephemeral: true,
    })
    getError(error, 'setStatus')
  }
}
const options = { deleted: false }

module.exports = { data, run, options }

const chalk = require('chalk')
const { playerCountCH, commands } = require('../../../config')
const { getServerDataOnly, getDebug, getError } = require('../../index')
const fs = require('node:fs')
const json5 = require('json5')
const consoleLogData = fs.readFileSync(`./translation/${commands.language}/console-log.json5`, 'utf8')
const consoleLog = json5.parse(consoleLogData)

module.exports = async (client) => {
  const playerCountUpdate = async (channelId) => {
    try {
      const channel = client.channels.cache.get(channelId)
      const { data, isOnline } = await getServerDataOnly()
      const statusName = isOnline
        ? playerCountCH.onlineText
            .replace(/\{playeronline}/g, data.players.online)
            .replace(/\{playermax}/g, data.players.max)
        : playerCountCH.offlineText
      await channel.edit({
        name: statusName,
      })
      getDebug(
        consoleLog.debug.playerCountChUpdate.replace(
          /\{updatedName\}/gi,
          isOnline ? chalk.green(statusName) : chalk.red(statusName)
        )
      )
    } catch (error) {
      getError(error, 'playerCountChNameUpdate')
    }
  }
  try {
    if (!playerCountCH.enabled) return
    const guild = client.guilds.cache.get(playerCountCH.guildID)
    if (!guild) {
      let error = {
        message: consoleLog.playerCountCh.playerCountChGuildIncorrect.replace(/\{guildID\}/gi, playerCountCH.guildID),
      }
      getError(error, '')
      process.exit(1)
    }
    const dataIDS = JSON.parse(fs.readFileSync('./src/data.json', 'utf-8'))
    if (dataIDS.playerCountStats === null) {
      if (playerCountCH.channelId) {
        const channel = client.channels.cache.get(playerCountCH.channelId)
        if (channel) {
          console.log(
            consoleLog.playerCountCh.playerCountChannelFound.replace(/\{channelName\}/gi, chalk.cyan(channel.name))
          )
          dataIDS.playerCountStats = channel.id
          fs.writeFile('./src/data.json', JSON.stringify(dataIDS, null, 2), (err) => {
            if (err) {
              console.error(getError(err, 'Saving Player Count stats'))
            }
          })
        } else {
          let error = {
            message: consoleLog.playerCountCh.playerCountChannelFound.replace(
              /\{channelId\}/gi,
              chalk.cyan(playerCountCH.channelId)
            ),
          }
          getError(error, '')
          process.exit(1)
        }
      } else {
        const guild = client.guilds.cache.get(playerCountCH.guildID)
        const { ChannelType } = require('discord.js')
        const { data, isOnline } = await getServerDataOnly()
        const statusName = isOnline
          ? playerCountCH.onlineText
              .replace(/\{playeronline}/g, data.players.online)
              .replace(/\{playermax}/g, data.players.max)
          : playerCountCH.offlineText
        const channel = await guild.channels.create({
          name: statusName,
          type: ChannelType.GuildVoice,
          permissionOverwrites: [
            {
              id: guild.roles.everyone.id,
              deny: ['Connect'],
            },
          ],
        })
        dataIDS.playerCountStats = channel.id
        fs.writeFile('./src/data.json', JSON.stringify(dataIDS, null, 2), (error) => {
          if (error) {
            getError(error, 'playerCountChDateWrite')
          }
        })
        console.log(
          consoleLog.playerCountCh.playerCountChannelCreated.replace(/\{updatedStatus\}/gi, chalk.cyan(statusName))
        )
        setInterval(() => {
          playerCountUpdate(dataIDS.playerCountStats)
        }, 60000)
      }
    } else {
      playerCountUpdate(dataIDS.playerCountStats)
      setInterval(() => {
        playerCountUpdate(dataIDS.playerCountStats)
      }, 60000)
    }
  } catch (error) {
    getError(error, 'playerCountCh')
  }
}

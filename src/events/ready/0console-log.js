const chalk = require('chalk')
const config = require('../../../config')
const fs = require('fs')
const json5 = require('json5')

languageConsoleOuput = config.settings.language.consoleLog
  ? config.settings.language.consoleLog
  : config.settings.language.main
const consoleLogData = fs.readFileSync(`./translation/${languageConsoleOuput}/console-log.json5`, 'utf8')
const consoleLog = json5.parse(consoleLogData)

module.exports = async (client) => {
  if (config.settings.logging.inviteLink) {
    console.log(
      consoleLog.inviteLink
        .replace(/\{botUserTag\}/gi, chalk.cyan(client.user.tag))
        .replace(
          /\{inviteLink\}/gi,
          chalk.cyan(`https://discord.com/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot`)
        )
    )
  }
  if (!config.settings.logging.serverInfo) return
  const { getServerDataOnly } = require('../../index')
  const { data, isOnline } = await getServerDataOnly()
  let ipBedrock = `${config.mcserver.ip}\n${chalk.reset('Port')}     | ${chalk.cyan.bold(config.mcserver.port)}`
  const port = config.mcserver.port === 25565 ? '' : `:${config.mcserver.port}`
  const ipJava = `${config.mcserver.ip} ${port}`
  const ip = config.mcserver.type === 'bedrock' ? ipBedrock : ipJava
  if (isOnline) {
    const serverInfoStartOnline = consoleLog.serverInfoStart.online.join('\n')
    console.log(
      serverInfoStartOnline
        .replace(/\{ip\}/gi, chalk.cyan.bold(ip))
        .replace(/\{version\}/gi, chalk.cyan.bold(config.mcserver.version))
        .replace(/\{playersOnline\}/gi, chalk.cyan.bold(data.players.online))
        .replace(/\{playersMax\}/gi, chalk.cyan.bold(data.players.max))
        .replace(/\{motd_line1\}/gi, chalk.cyan.bold(data.motd.clean.split('\n')[0]))
        .replace(/\{motd_line2\}/gi, chalk.cyan.bold(data.motd.clean.split('\n')[1]))
    )
  } else {
    const ip = config.mcserver.type === 'bedrock' ? config.mcserver.ip : ipJava
    const serverInfoStartOffline = consoleLog.serverInfoStart.offline.join('\n')
    console.log(
      serverInfoStartOffline
        .replace(/\{ip\}/gi, chalk.red.bold(ip))
        .replace(/\{port\}/gi, chalk.red(config.mcserver.port))
        .replace(
          /\{mcServerType\}/gi,
          chalk.red.bold(config.mcserver.type.charAt(0).toUpperCase() + config.mcserver.type.slice(1))
        )
    )
  }
}

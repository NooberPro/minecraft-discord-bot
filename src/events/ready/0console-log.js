const chalk = require('chalk');
const config = require('../../../config');
module.exports = async (client) => {
  if (config.settings.logging.inviteLink) {
    console.log(
      `✅ ${chalk.cyan(client.user.tag)} is online.\nInvite the bot with ${chalk.cyan(
        `https://discord.com/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot`
      )}\n`
    );
  }
  if (!config.settings.logging.serverInfo) return;
  const { getServerDataOnly } = require('../../index');
  const { data, isOnline } = await getServerDataOnly();
  let ipBedrock = `${config.mcserver.ip}\n${chalk.reset('Port')}     | ${chalk.cyan.bold(config.mcserver.port)}`;
  const port = config.mcserver.port === 25565 ? '' : `:${config.mcserver.port}`;
  const ipJava = `${config.mcserver.ip} ${port}`;
  const ip = config.mcserver.type === 'bedrock' ? ipBedrock : ipJava;
  if (isOnline) {
    console.log(chalk.cyan('--------------------------------------------------------'));
    console.log(`IP       | ${chalk.cyan.bold(ip)}`);
    console.log(`VERSION  | ${chalk.cyan.bold(config.mcserver.version)}`);
    console.log(`PLAYERS  | ${chalk.cyan.bold(data.players.online + '/' + data.players.max)}`);
    console.log(
      `MOTD     | ${chalk.cyan.bold(
        data.motd.clean.split('\n').join(`\n         ${chalk.reset('|')}${chalk.cyan.bold(' ')}`)
      )}`
    );
    console.log(chalk.cyan('--------------------------------------------------------'));
  } else {
    const ip = config.mcserver.type === 'bedrock' ? config.mcserver.ip : ipJava;
    console.log(
      chalk.keyword('orange')(
        `Currently could not locate the Minecraft with:\n----------------------------------------------\nIP   | ${chalk.red.bold(
          ip
        )}\nPORT | ${chalk.red(config.mcserver.port)}\nTYPE | ${chalk.red.bold(
          config.mcserver.type.charAt(0).toUpperCase() + config.mcserver.type.slice(1)
        )}\n----------------------------------------------`
      )
    );
  }
};

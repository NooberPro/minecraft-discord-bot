const chalk = require('chalk');
module.exports = (client) => {
  console.log(
    `✅ ${chalk.cyan(
      client.user.tag
    )} is online.\nInvite the bot with ${chalk.cyan(
      `https://discord.com/oauth2/authorize?client_id=${client.user.id}&permissions=93184&scope=bot%20applications.commands`
    )}`
  );
};
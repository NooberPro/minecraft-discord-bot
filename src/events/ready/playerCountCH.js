const chalk = require('chalk');
const { playerCountCH, settings } = require('../../../config');
const { getServerDataOnly, getDebug, getError, getDateNow } = require('../../index');
const fs = require('node:fs');

module.exports = async (client) => {
  const playerCountUpdate = async (channelId) => {
    try {
      const channel = client.channels.cache.get(channelId);
      const { data, isOnline } = await getServerDataOnly();
      const statusName = isOnline
        ? playerCountCH.onlineText
            .replace(/\{playeronline}/g, data.players.online)
            .replace(/\{playermax}/g, data.players.max)
        : playerCountCH.offlineText;
      await channel.edit({
        name: statusName,
      });
      if (settings.logging.debug) {
        console.log(
          getDebug(
            'Player Count channel name is updated to',
            isOnline ? chalk.green(statusName) : chalk.red(statusName)
          )
        );
      }
    } catch (error) {
      if (settings.logging.error) {
        console.log(getError(error, 'Player Count Channel name update'));
      }
    }
  };
  try {
    if (!playerCountCH.enabled) return;
    const guild = client.guilds.cache.get(playerCountCH.guildID);
    if (!guild) {
      console.error(
        `${chalk.gray(getDateNow())} | ${chalk.keyword('orange')('WARN')} | ${chalk.bold(
          `The guild with ID: ${chalk.yellow(
            `\`${playerCountCH.guildID}\``
          )} was not found or the bot is not in the guild.`
        )}`
      );
      process.exit(1);
    }
    const dataIDS = JSON.parse(fs.readFileSync('./src/data.json', 'utf-8'));
    if (dataIDS.playerCountStats === null) {
      if (playerCountCH.channelId) {
        const channel = client.channels.cache.get(playerCountCH.channelId);
        if (channel) {
          console.log(`Successfully founded channel: ${chalk.cyan(channel.name)} channel for Player Count.`);
          dataIDS.playerCountStats = channel.id;
          fs.writeFile('./src/data.json', JSON.stringify(dataIDS, null, 2), (err) => {
            if (err) {
              console.error(getError(err, 'Saving Player Count stats'));
            }
          });
        } else {
          console.error(
            `${chalk.gray(getDateNow())} | ${chalk.keyword('orange')('WARN')} | ${chalk.bold(
              `The channel for Player Count with ID: ${chalk.yellow(
                `\`${playerCountCH.channelId}\``
              )} was not found or the bot has no access for channel.`
            )}`
          );
          process.exit(1);
        }
      } else {
        const guild = client.guilds.cache.get(playerCountCH.guildID);
        const { ChannelType } = require('discord.js');
        const { data, isOnline } = await getServerDataOnly();
        const statusName = isOnline
          ? playerCountCH.onlineText
              .replace(/\{playeronline}/g, data.players.online)
              .replace(/\{playermax}/g, data.players.max)
          : playerCountCH.offlineText;
        const channel = await guild.channels.create({
          name: statusName,
          type: ChannelType.GuildVoice,
          permissionOverwrites: [
            {
              id: guild.roles.everyone.id,
              deny: ['Connect'],
            },
          ],
        });
        dataIDS.playerCountStats = channel.id;
        fs.writeFile('./src/data.json', JSON.stringify(dataIDS, null, 2), (err) => {
          if (err) {
            console.error(err);
          }
        });
        console.log(`Created a channel for Player Count and has updated its name to: ${chalk.cyan(statusName)}`);
        setInterval(() => {
          playerCountUpdate(dataIDS.playerCountStats);
        }, 60000);
      }
    } else {
      playerCountUpdate(dataIDS.playerCountStats);
      setInterval(() => {
        playerCountUpdate(dataIDS.playerCountStats);
      }, 60000);
    }
  } catch (error) {
    if (settings.logging.error) {
      console.log(getError(error, 'Player Count Channel'));
    }
  }
};

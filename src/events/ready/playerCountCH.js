const chalk = require('chalk');
const { playerCountCH } = require('../../../config');
const { getServerDataOnly, getDebug, getError } = require('../../index');
const fs = require('node:fs');

module.exports = async (client) => {
  try {
    if (!playerCountCH.enabled) return;
    const playerCountUpdate = async (channelId) => {
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
      console.log(
        getDebug(
          'Player Count channel name is updated to',
          isOnline ? chalk.green(statusName) : chalk.red(statusName)
        )
      );
    };

    const dataIDS = JSON.parse(fs.readFileSync('./src/data.json', 'utf-8'));
    if (dataIDS.playerCountStats === null) {
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
      fs.writeFile(
        './src/data.json',
        JSON.stringify(dataIDS, null, 2),
        (err) => {
          if (err) {
            console.error(err);
          }
        }
      );
      setInterval(() => {
        playerCountUpdate(dataIDS.playerCountStats);
      }, 60000);
    } else {
      playerCountUpdate(dataIDS.playerCountStats);
      setInterval(() => {
        playerCountUpdate(dataIDS.playerCountStats);
      }, 60000);
    }
  } catch (error) {
    console.log(getError(error, 'Player Count Channel'));
  }
};

const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
module.exports = {
  data: new SlashCommandBuilder()
    .setName('botinfo')
    .setDescription('Sends the CPU, Memory Stats of the Bot.')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  run: async ({ interaction, client }) => {
    interaction.deferReply({
      ephemeral: true,
    });
    try {
      const reply = await interaction.fetchReply();
      const ping = reply.createdTimestamp - interaction.createdTimestamp;
      const os = require('os');
      const process = require('node:process');
      const cpuUsage = (os.loadavg()[0] / os.cpus().length).toFixed(2);
      const memoryUsage = (
        process.memoryUsage().heapUsed /
        1024 /
        1024
      ).toFixed(2);
      const nodeVersion = process.version;
      const uptimeSeconds = process.uptime();
      const uptimeMinutes = Math.floor(uptimeSeconds / 60);
      const uptimeHours = Math.floor(uptimeMinutes / 60);
      const uptimeDays = Math.floor(uptimeHours / 24);
      await interaction.editReply({
        ephemeral: true,
        embeds: [
          {
            author: {
              name: client.user.tag,
              icon_url: client.user.avatarURL(),
            },
            title: '**Bot Info and Stats**',
            description: `**CPU Usage: \`${cpuUsage}%\`\nMemory Usage: \`${memoryUsage}MB\`\nNode.js Version: \`${nodeVersion}\`\nBot uptime: \`${uptimeDays}\` days, \`${
              uptimeHours % 24
            }\` hours, \`${uptimeMinutes % 60}\`, minutes, \`${Math.floor(
              uptimeSeconds
            )}\` seconds \n Ping: Client \`${ping}ms\` | Websocket: \`${
              client.ws.ping
            }ms\` **`,
          },
        ],
      });
    } catch (error) {
      interaction.editReply({
        content: 'Error with getting Bot Info',
        ephemeral: true,
      });
      const { settings } = require('../../config');
      if (settings.logging.error) {
        const { getError } = require('../index');

        console.log(getError(error, 'Slash command - Botinfo'));
      }
    }
  },
};

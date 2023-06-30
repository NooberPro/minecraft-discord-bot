const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { statusMessageEdit } = require('../index');
const config = require('../../config');
const chalk = require('chalk');
module.exports = {
  data: new SlashCommandBuilder()
    .setName('setstatus')
    .setDescription(
      'Sets the Minecraft server status message in the current channel.'
    )
    .setDefaultMemberPermissions(
      PermissionFlagsBits.ManageChannels,
      PermissionFlagsBits.ManageThreads,
      PermissionFlagsBits.ModerateMembers
    ),

  run: async ({ interaction, client }) => {
    await interaction.deferReply({ ephemeral: true });
    try {
      const channel = client.channels.cache.get(interaction.channelId);
      channel.send(':gear: Checking the status...').then(async (msg) => {
        interaction.editReply({
          content: `:arrows_clockwise: Checking status and necessary info.`,
          ephemeral: true,
        });
        const fs = require('fs').promises;
        let data = await fs.readFile('./src/data.json', 'utf-8');
        data = await JSON.parse(data);
        data.channelId = interaction.channelId;
        data.messageId = msg.id;
        fs.writeFile(
          './src/data.json',
          JSON.stringify(data, null, 2),
          (err) => {
            if (err) {
              const { getError } = require('../index');
              if (config.settings.logging.error) {
                console.log(
                  getError(
                    err,
                    'Saving Message and Channel Id of status message '
                  )
                );
              }
            }
          }
        );
        setTimeout(async () => {
          const dataRead = await fs.readFile('./src/data.json', 'utf-8');
          let dataID = JSON.parse(dataRead);
          await statusMessageEdit();
          interaction.editReply({
            content: `:white_check_mark: **Status message is set successfully in <#${dataID.channelId}>. Message:** https://discord.com/channels/${msg.guildId}/${dataID.channelId}/${dataID.messageId}`,
            ephemeral: true,
          });
          console.log(
            `Successfully set the status message in ${chalk.cyan(
              `#${msg.channel.name}`
            )}`
          );
          setInterval(() => {
            statusMessageEdit();
          }, config.autoChangeStatus.updateInterval * 1000);
        });
      }, 1000);
    } catch (error) {
      interaction.editReply({
        content: `:warning: Could not set status message because of an error: ${error.message}`,
        ephemeral: true,
      });
      const { getError } = require('../index');
      if (settings.logging.error) {
        console.log(getError(error, 'Setting status message'));
      }
    }
  },
  deleted: !config.autoChangeStatus.enabled, // Deletes the command from Discord
};

const fs = require("fs");
const mcs = require("node-mcstatus");
const { Client, IntentsBitField, EmbedBuilder } = require("discord.js");
const c = require("../config.js");
const { CommandHandler } = require("djs-commander");
const path = require("path");
const data = JSON.parse(fs.readFileSync("data.json"));

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});

new CommandHandler({
  client,
  eventsPath: path.join(__dirname, "events"),
});

const offlineStatus = new EmbedBuilder()
  .setColor("DarkRed")
  .setTitle(":red_circle: OFFLINE")
  .setAuthor({ name: c.mcserver.name, iconURL: c.mcserver.icon })
  .setTimestamp()
  .setFooter({ text: "Updated at" });

async function statusEdit(statusEmbed, status) {
  try {
    const channel = await client.channels.fetch(data.channelId);
    const message = await channel.messages.fetch(data.messageId);
    await message.edit({ content: "", embeds: [statusEmbed] });
    console.log(`The status is updated to ${status}`);
  } catch (error) {
    console.error(error);
  }
}

function statusRetrival() {
  mcs
    .statusJava(c.mcserver.ip, c.mcserver.port)
    .then((data) => {
      module.exports = {
        data,
      };
      if (data.online === true && data.players.max > 0) {
        const playerList = data.players.list.reduce((acc, item) => {
          return acc + item.name_clean + "\n";
        }, "");
        const onlineStatus = new EmbedBuilder()
          .setColor("DarkGreen")
          .setTitle(":green_circle: ONLINE")
          .setAuthor({ name: c.mcserver.name, iconURL: c.mcserver.icon })
          .addFields(
            {
              name: "__**PLAYERS**__",
              value:
                `**${data.players.online}**/**${data.players.max}**\n` +
                `\`\`\`${playerList}\`\`\``,
            },
            {
              name: "__**MOTD**__",
              value: `**${data.motd.clean}**`,
            },
            {
              name: "__**INFO**__",
              value: `**${data.version.name_clean}**`,
            },
            {
              name: "__**IP ADDRESS**__",
              value: `**${data.host}:${data.port}**`,
            }
          )
          .setTimestamp()
          .setFooter({
            text: "Updated at",
          });
        statusEdit(onlineStatus, "✔ Online");
      } else {
        statusEdit(offlineStatus, "❌Offline");
      }
    })
    .catch((error) => {
      statusEdit(offlineStatus, "❌Offline");
      console.error(error);
    });
}

module.exports = {
  statusEdit,
  statusRetrival,
};

client.login(c.bot.token);

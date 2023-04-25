const mcs = require("node-mcstatus");
const { Client, IntentsBitField, EmbedBuilder } = require("discord.js");
const c = require("../config.js");
const fs = require("fs");

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});

const data = JSON.parse(fs.readFileSync("data.json"));
const timeInterval = c.bot.updateInterval * 1000;

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

client.on("messageCreate", (message) => {
  if (message.content === "!setstatus") {
    console.log(message.channel.id);
    const channel = client.channels.cache.get(message.channel.id);
    if (!channel) return console.error("Invalid channel ID.");
    channel
      .send(
        `:gear:Checking the status...\nWaiting for ${c.bot.name} to restart.`
      )
      .then((msg) => {
        const json = {
          messageId: null,
          channelId: null,
        };
        fs.writeFileSync("data.json", JSON.stringify(json));
        const data = JSON.parse(fs.readFileSync("data.json"));
        data.messageId = msg.id;
        data.channelId = message.channel.id;
        fs.writeFileSync("data.json", JSON.stringify(data));
        console.log(`The status channel has been set to #${channel.name}.`);
      })
      .catch(console.error);
  }
});

function statusRetrival() {
  mcs
    .statusJava(c.mcserver.ip, c.mcserver.port)
    .then((data) => {
      if (data.online === true) {
        if (data.players.max === 0) {
          statusEdit(offlineStatus, "❌ Offline");
        } else {
          const onlineStatus = new EmbedBuilder()
            .setColor("DarkGreen")
            .setTitle(":green_circle: ONLINE")
            .setAuthor({ name: c.mcserver.name, iconURL: c.mcserver.icon })
            .addFields(
              {
                name: "__**PLAYERS**__",
                value: `**${data.players.online}**/**${data.players.max}\n**`,
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
        }
      } else {
        statusEdit(offlineStatus, "❌Offline");
      }
    })
    .catch((error) => {
      console.log(error);
    });
}
client.on("ready", (c) => {
  console.log(
    `✅ ${c.user.tag} is online.\nInvite the bot with https://discord.com/oauth2/authorize?client_id=${client.user.id}&permissions=93184&scope=bot%20applications.commands`
  );
  if (data.channelId === null) {
    console.log(
      "To set server status, send a `!setstatus` message in the desired channel."
    );
  } else {
    setInterval(statusRetrival, timeInterval);
    statusRetrival();
  }
});

client.login(c.bot.token);

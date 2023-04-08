const dotenv = require("dotenv");
const { PingMC } = require("pingmc");
const {
  Client,
  IntentsBitField,
  EmbedBuilder,
  WebhookClient,
} = require("discord.js");
dotenv.config();

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});

client.on("ready", () => {
  console.log(`✅ ${client.user.tag} is online.`);
  setInterval(serverembed, process.env.statusupdatetime);
});
if (process.env.messageid.includes("message")) {
  const webhookClient = new WebhookClient({
    url: process.env.webhookurl,
  });
  webhookClient.send({
    content: `copy the id of this message`,
    username: process.env.botname,
    avatarURL: process.env.iconurl,
  });
  console.log("Copy the message id from and paste in .env file\n");
  process.exit();
}

function serverembed() {
  new PingMC(process.env.serveraddress)
    .ping()
    .then((data) => {
      if (data.players.max === 0) {
        console.log("Updating to Offline");
        const offlineEmbed = new EmbedBuilder()
          .setColor("Red")
          .setAuthor({
            name: process.env.servername,
            iconURL: process.env.iconurl,
          })
          .setDescription(":x:**OFFLINE**")
          .setTimestamp()
          .setFooter({
            text: `Last Updated on`,
          });

        const webhookClient = new WebhookClient({
          url: process.env.webhookurl,
        });
        const main = async () => {
          await webhookClient.editMessage(process.env.messageid, {
            content: "",
            username: process.env.botname,
            avatarURL: "",
            embeds: [offlineEmbed],
          });
        };
        main();
      }
      if (data.players.max === 20) {
        console.log("Updating to Online");
        const pList = data.players.list
          ? "```" + data.players.list.join("\r\n") + "```"
          : "";
        const onlineEmbeds = new EmbedBuilder()
          .setColor("Green")
          .setTitle(":white_check_mark:**ONLINE**")
          .setAuthor({
            name: process.env.servername,
            iconURL: process.env.iconurl,
          })
          .addFields(
            {
              name: "__**PLAYERS**__",
              value: `**${data.players.online}**/**${data.players.max}\n**${pList}`,
            },
            {
              name: "__**MOTD**__",
              value: `**${data.motd.clear}**`,
            },
            {
              name: "__**INFO**__",
              value: `**${data.version.name} ${data.version.major}**\n**Ping: ${data.ping}**`,
            },
            {
              name: "__**IP ADDRESS**__",
              // value: `**${process.env.serveraddress}**`,
              value: `**yourserver.com:25565**`,
            }
          )
          .setTimestamp()
          .setFooter({
            text: `Last Updated on`,
          });
        const webhookClient = new WebhookClient({
          url: process.env.webhookurl,
        });
        const main = async () => {
          await webhookClient.editMessage(process.env.messageid, {
            content: "",
            username: process.env.botname,
            avatarURL: "",
            embeds: [onlineEmbeds],
          });
        };
        main();
      }
    })
    .catch((error) => {
      console.log("Updating to Offline");
      const offlineEmbed = new EmbedBuilder()
        .setAuthor({
          name: process.env.servername,
          iconURL: process.env.iconurl,
        })
        .setDescription(":x:**OFFLINE**")

        .setTimestamp()
        .setFooter({
          text: `Last Updated on`,
        });
      const main = async () => {
        const webhookClient = new WebhookClient({
          url: process.env.webhookurl,
        });
        await webhookClient.editMessage(process.env.messageid, {
          content: "",
          username: process.env.botname,
          avatarURL: "",
          embeds: [offlineEmbed],
        });
      };
      main();
    });
}
client.on("ready", () => {
  console.log(
    "Invite link is \n" +
      `https://discord.com/oauth2/authorize?client_id=${client.user.id}&permissions=93184&scope=bot%20applications.commands`
  );
});

client.login(process.env.token);

serverembed();

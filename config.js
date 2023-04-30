// All of these info is editable and Required.
module.exports = {
  bot: {
    token: "your-bot-token-here", // Paste Your Bot's Token here
    updateInterval: 60, // Time Period between auto changing status in seconds like 60sec = 1min. Recommend is above 60.
  },

  mcserver: {
    ip: "demo.mcstatus.io", // Ip Address of your minecraft server like mc.hypixel.net
    port: 25565, // Port of your minecraft server like 25565. Default is 25565 if nothing is defined here.
    name: "Demo Server", //Name of your Minecraft Server like Hypixel
    icon: "https://i.imgur.com/eBM2SXq.png", //Url of your server icon.
  },

  status_reply: {
    // If a message contains triggerWords and reply if server is online with players or offline.
    enabled: false,
    triggerWords: [
      // Add words by "" and ,
      "Is the server up ?",
      "Is the server online ?",
      "Is the server down ?",
      // "Example Word",
      // "Example Setence",
    ],
  },
};

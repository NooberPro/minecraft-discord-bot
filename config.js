// All of these info is editable and Required.
module.exports = {
  bot: {
    token: 'your-bot-token-here', // Paste Your Bot's Token here
    updateInterval: 60, // Time Period between auto changing status in seconds like 60sec = 1min. Recommend is above 60.
    presence: {
      text: {
        // Use {playeronline} for no. of players online and {playermax} for maximum players .
        online: '{playeronline}/{playermax} players online', // Custom text of your choice.
        offline: 'Server is Offline', // Status text when the server is offline.
      },
      status: {
        // online, idle, dnd (do not disturb), invisible are the options
        online: 'online', // The status of the bot when mc server is Online.
        offline: 'idle', // The status of the bot when mc server is Offline.
      },
      activity: 'Watching', // Playing, Listening, Watching, Competing are the options. This comes before the status text.
    },
  },
  mcserver: {
    ip: 'demo.mcstatus.io', // Ip Address of your minecraft server like mc.hypixel.net
    port: 25565, // Port of your minecraft server like 25565 for java and 19132 for bedrock.
    type: 'java', // Type of minecraft server, "java" or "bedrock". Default is Java.
    name: 'Demo Server', //Name of your Minecraft Server like Hypixel
  },
  status_reply: {
    // If a message contains triggerWords and reply if server is online with players or offline.
    enabled: false,
    triggerWords: [
      // Add words by '' and ,
      'Is the server up ?',
      'Is the server online ?',
      'Is the server down ?',
      // "Example Word",
      // "Example Setence",
    ],
  },
};

// All of these info is editable and Required.
module.exports = {
  bot: {
    token: 'your-bot-token-here', // Paste Your Bot's Token here
    updateInterval: 60, // Time Period between auto changing status in seconds like 60 = 1min. Recommend is above 60.
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
    version: 'Requires 1.8 - 1.20', // Version of your Minecraft server. You can put anything there. It will come in the embed
    site: '', // Url of your minecraft server website or vote website. NOT REQUIRED.
  },
  infoReply: {
    // If a message contains triggerWords then reply version,ip,site,status etc.
    enabled: true,
    triggerWords: {
      version: ['version of the server?', 'version'],
      ip: ['ip of the server', 'ip'],
      site: ['website link', 'website', 'url', 'site'],
      status: ['is server online?', 'is server down?', 'is server offline'],
    },
  },
  // Setting for bot
  settings: {
    autoChangeStatus: true, // Auto changing status message and activity presence.
    // console-logging settings.
    logging: {
      inviteLink: true, // Logs invite link at bot's launch
      statusMessageUpdate: false, // Logs every Status message update (pretty much like spam)
      activityUpdate: false, // Logs every bot activity update (pretty much like spam)
      errorLog: true, // Logs the errors if there any
    },
  },
};

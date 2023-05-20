//Config Explaination: https://nooberpro.gitbook.io/minecraft-discord-bot/installation/config
module.exports = {
  bot: {
    token: 'your-bot-token-here', // Paste Your Bot's Token here
    // Auto changing status message and activity presence.
    presence: {
      text: {
        // Use {playeronline} for no. of players online and {playermax} for maximum players .
        online: 'with {playeronline}/{playermax} players', // Custom text of your choice.
        offline: 'Server Offline', // Status text when the server is offline.
      },
      status: {
        // online, idle, dnd (do not disturb), invisible are the options
        online: 'online', // The status of the bot when mc server is Online.
        offline: 'idle', // The status of the bot when mc server is Offline.
      },
      activity: 'Playing', // Playing, Listening, Watching, Competing are the options. This comes before the status text.
    },
  },
  mcserver: {
    ip: 'demo.mcstatus.io', // Ip Address of your minecraft server like mc.hypixel.net
    port: 25565, // Port of your minecraft server like 25565 for java and 19132 for bedrock.
    type: 'java', // Type of minecraft server, "java" or "bedrock". Default is Java.
    name: 'Demo Server', //Name of your Minecraft Server like Hypixel
    version: 'Requires 1.8 - 1.20', // Version of your Minecraft server. You can put anything there. It will come in the embed
    icon: 'https://i.imgur.com/f35CYQs.png', // Url of minecraft server icon. How? https://tinyurl.com/iconurl
    site: 'https://nooberpro.gitbook.io', // Url of your minecraft server website or vote website. NOT REQUIRED.
  },
  infoReply: {
    // If a message contains triggerWords then reply version,ip,site,status etc.
    enabled: false,
    triggerWords: {
      version: ['version of the server?', 'version'],
      ip: ['ip of the server', 'ip'],
      site: ['website link', 'website', 'url', 'site'],
      status: ['is server online?', 'is server down?', 'is server offline'],
    },
  },
  // Setting for bot
  settings: {
    autoChangeStatus: {
      enabled: false,
      updateInterval: 60, // Time Period between auto changing status in seconds like 60 = 1min. Recommend is above 60.
      setstatus: true, // Enable if status message can be set by sending "!setstatus" in any channel.
      channelId: '', //Enter channel ID or use "!setstatus" in any channel to set status. How? https://tinyurl.com/discordChannelId
    },
    // console-logging settings.
    logging: {
      inviteLink: true, // Logs invite link at bot's launch
      statusMessageUpdate: false, // Logs every Status message update (pretty much like spam)
      activityUpdate: false, // Logs every bot activity update (pretty much like spam)
      errorLog: true, // Logs the errors if there any
    },
  },
  commands: {
    slashCommands: true, // Enable slash(/) commands.
    prefixCommands: {
      enabled: true, // Enable normal prefix commands.
      prefix: '!', // Prefix for normal commands.
    },
    ip: {
      enablePrefix: true, // Enable prefix commands for ip.
      enableSlash: true, // Enable slash commands for ip.
    },
    players: {
      enablePrefix: true, // Enable prefix commands for players.
      enableSlash: true, // Enable slash commands for players.
    },
    site: {
      enablePrefix: true, // Enable prefix commands for site.
      enableSlash: true, // Enable slash commands for site.
    },
    status: {
      enablePrefix: true, // Enable prefix commands for status.
      enableSlash: true, // Enable slash commands for status.
    },
    version: {
      enablePrefix: true, // Enable prefix commands for version.
      enableSlash: true, // Enable slash commands for version.
    },
  },
};

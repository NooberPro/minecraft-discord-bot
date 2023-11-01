//Config Explaination: https://nooberpro.gitbook.io/minecraft-discord-bot/installation/config
// "MC" is referring to Minecraft in the comments for convenience.
module.exports = {
  bot: {
    token: 'your-bot-token-here',
    // Auto changing status and activity of bot.
    presence: {
      enabled: true,
      activity: 'Playing', // Options: Playing, Listening, Watching, Competing.
      text: {
        online: 'with {playeronline}/{playermax} players', // {playeronline} and {playermax} show number of online and max players.
        offline: 'Server Offline', // Status text when the server is offline.
      },
      status: {
        // Options: online, idle, dnd, invisible.
        online: 'online', // Status when MC server is online.
        offline: 'idle', // Status when MC server is offline.
      },
    },
  },
  mcserver: {
    ip: 'demo.mcstatus.io', // IP of  MC server.
    port: 25565, // Port number of MC server. Use Query Port in Java for full Player List.
    type: 'java', // Type of MC server: "java" or "bedrock".
    name: 'Demo Server', // Name of MC server.
    version: 'Requires 1.8 - 1.20', // Version of MC server.
    icon: 'https://i.imgur.com/6Msem8Q.png', // URL of MC server icon. How? https://tinyurl.com/iconurl
    site: 'https://nooberpro.gitbook.io/', // URL of MC server or vote website.
    // To disable site commands leave site field blank. NOT REQUIRED
  },

  // Settings for bot.
  settings: {
    // console-logging settings.
    logging: {
      inviteLink: true, // Log invite link at bot's launch.
      debug: false, // Log status message and  bot activity update. (pretty much like spam)
      error: true, // Log any errors that occur.
      serverInfo: true, // Log basic info about server and check if it is online at startup.
    },
  },

  // Features settings

  // Automatically Updates the current status of a Mc server in a channel, in real time.
  autoChangeStatus: {
    enabled: false,
    updateInterval: 60, // Time period between auto changing status in seconds, e.g. 60 = 1min. Recommended: above 60.
    // These settings will be applied in slash (/) and prefix commands for status.
    isOnlineCheck: true, // Useful for servers which uses free hosting providers like Aternos. If the server's max players is 0 then status will set offline.
  },

  // Shows the Player Count of MC server in channel's name
  playerCountCH: {
    enabled: false,
    guildID: 'your-guild-id-here', // Server's ID for creating/editing channel stats.
    channelId: '', // The channel ID for editing the player count. If no ID is provided, the bot will create the channel itself. NOT REQUIRED
    // {playeronline} and {playermax} show number of online and max players.
    onlineText: '🟢 {playeronline}/{playermax} Players playing',
    offlineText: '🔴 Offline', // The name set when MC server is offline.
  },

  autoReply: {
    // If a message contains triggerWords, reply with appropriate server information.
    enabled: false, // Disable the entire autoReply feature.
    version: {
      enabled: true,
      triggerWords: ['version of the server?', 'version'],
    },
    ip: {
      enabled: true,
      triggerWords: ['ip of the server', 'ip'],
    },
    site: {
      enabled: true,
      triggerWords: ['website link', 'website', 'url', 'site', 'vote url', 'link'],
    },
    status: {
      enabled: true,
      triggerWords: ['is server online?', 'is server offline', 'status of the server'],
    },
  },

  commands: {
    slashCommands: true, // Enables all slash commands
    prefixCommands: {
      enabled: true,
      prefix: '!', // Prefix for normal command.
    }, // Enables all prefix commands

    // en(English), es(Spanish), de(German), fr(French), pt(Portuguese), ru(Russian)
    language: 'en', // Works only for embeds. (files in ./translation/)

    ip: {
      enabled: true, // Enables ip command.
      alias: ['ip-address'], // Alias for ip prefix commands.
    },
    site: {
      enabled: true, // Enables ip command.
      alias: ['vote', 'link'], // Alias for site prefix commands.
    },
    version: {
      enabled: true, // Enables ip command.
      alias: [], // Alias for version prefix commands.
    },
    players: {
      enabled: true, // Enables ip command.
      alias: ['plist'], // Alias for players prefix commands.
    },
    status: {
      enabled: true, // Enables ip command.
      alias: ['info'], // Alias for status prefix commands.
    },
    motd: {
      enabled: true, // Enables ip command.
      alias: [], // Alias for motd prefix commands.
    },
    help: {
      enabled: true, // Enables ip command.
      alias: ['commands'], // Alias for help prefix commands.
    },
  },
}

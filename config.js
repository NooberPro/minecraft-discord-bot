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
    port: 25565, // Port number of MC server. Default Port - Java: 25565, Bedrock: 19132.
    type: 'java', // Type of MC server: "java" or "bedrock". Use Query Port in Java for full Player List.
    name: 'Demo Server', // Name of MC server.
    version: 'Requires 1.8 - 1.20', // Version of MC server.
    icon: 'https://i.imgur.com/6Msem8Q.png', // URL of MC server icon. How? https://tinyurl.com/iconurl
    site: 'https://nooberpro.gitbook.io/', // URL of MC server/vote website like https://nooberpro.gitbook.io/.
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
    // These settings will be applied in (/) and prefix commands for status.
    isOnlineCheck: true, // Useful for servers which uses free hosting providers like Aternos. If the server's max players is 0 then status will set offline.
  },
  // Shows the Player Count of MC server in channel's name
  playerCountCH: {
    enabled: false,
    guildID: 'your-guild-id-here', // Server's ID for creating/editing channel stats.
    // {playeronline} and {playermax} show number of online and max players.
    onlineText: '🟢 {playeronline}/{playermax} Players playing.',
    offlineText: '🔴 Offline', // The name set when MC server is offline.
  },
  autoReply: {
    // If a message contains triggerWords, reply with appropriate server information.
    enabled: false, // Disable the entire autoReply feature.
    version: {
      enabled: true,
      triggerWords: ['version of the server?', 'version'],
      // Use {version} to get the version in the config
      replyText: "The server's version: **`{version}`**",
    },
    ip: {
      enabled: true,
      triggerWords: ['ip of the server', 'ip'],
      // Use {ip} for ip and {port} for port.
      replyText: '**IP: `{ip}`\nPort: `{port}`**',
    },
    site: {
      enabled: true,
      triggerWords: ['website link', 'website', 'url', 'site', 'vote url'],
      // Use {site} for site
      replyText: "The server's website link: **<{site}>**",
    },

    status: {
      enabled: true,
      triggerWords: [
        'is server online?',
        'is server offline',
        'status of the server',
      ],
      // Use {playerOnline} for players online no. and {playerMax} for players max no. Only work in onlineReply.
      onlineReply:
        "The server's current status is **🟢`ONLINE`** with **`{playerOnline}/{playerMax}`** players playing.",
      offlineReply: "The server's current status is **🔴`OFFLINE`**.",
    },
  },
  commands: {
    slashCommands: true, // Enables all slash commands
    prefixCommands: {
      enabled: true,
      prefix: '!', // Prefix for normal command.
    }, // Enables all prefix commands
    ip: {
      slashEnabled: true, // Enable ip slash command.
      prefixEnable: true, // Enable ip prefix command.
      // Embed message customization or translating
      embed: {
        title: '__**SERVER ADDRESS**__',
        description: `**{ip}**`,
      },
    },
    site: {
      slashEnabled: true, // Enable site slash command.
      prefixEnable: true, // Enable site prefix command.
      embed: {
        title: '__**WEBSITE**__',
        description: `**Link: {site}**`,
      },
    },
    version: {
      slashEnabled: true, // Enable version slash command.
      prefixEnable: true, // Enable version prefix command.
      embed: {
        title: '__**VERSION**__',
        description: `**{version}**`,
      },
    },
    // Embed for offline status.
    offlineEmbed: {
      title: ':red_circle: OFFLINE',
    },
    players: {
      slashEnabled: true, // Enable players slash command.
      prefixEnable: true, // Enable players prefix command.
      embed: {
        title: '__**PLAYERS**__',
        description: '**{playeronline}/{playermax}**',
        // After description will be the Player Name List.
        // Shows offline Embed when MC server is offline.
      },
    },
    status: {
      slashEnabled: true, // Enable status slash command.
      prefixEnable: true, // Enable status prefix command.
      onlineEmbed: {
        title: ':green_circle: ONLINE',
        // Here the Player List Embed title and description from players embed above (line: 134)

        // After player List Field will be description.
        description: `
        __**MOTD**__
        **{motd}**

        __**SERVER ADDRESS**__
        **{ip}**

        __**VERSION**__
        **{version}**

        __**WEBSITE**__
        **Link: {site}**`,
      },
      // Shows offline Embed when MC server is offline
    },
    motd: {
      slashEnabled: true, // Enable motd slash command.
      prefixEnable: true, // Enable motd prefix command.
      embed: {
        title: '__**MOTD**__',
        description: `**{motd}**`,
      },
      // Shows offline Embed when MC server is offline
    },
    help: {
      slashEnabled: true, // Enable help slash command.
      prefixEnable: true, // Enable help prefix command.
      embed: {
        title: '__**COMMAND LIST**__',
        description: `
       **{prefix}\`help\`**: Shows a list of available commands.
       **{prefix}\`ip\`**: Sends the Server address of the Minecraft Server.
       **{prefix}\`motd\`**: Sends the Minecraft Server's Message Of The Day (MOTD).
       **{prefix}\`players\`**: Sends the list of online player in the Minecraft Server.
       **{prefix}\`status\`**: Sends the current status of the Minecraft Server.
       **{prefix}\`version\`**: Sends the version required for the Minecraft Server.
       **{prefix}\`site\`**: Sends the Minecraft Server's website/vote link.`,
      },
    },
  },
};

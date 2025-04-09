// Config Documentation: https://nooberpro.gitbook.io/minecraft-discord-bot/installation/config
// "MC" refers to Minecraft in the comments for convenience.
module.exports = {
  bot: {
    token: 'your-bot-token-here',
    // Automatically updates the bot's status and activity.
    presence: {
      enabled: true,
      activity: 'Playing', // Options: Playing, Listening, Watching, Competing.
      text: {
        online: 'with {playeronline}/{playermax} players', // {playeronline} and {playermax} display the current and maximum number of players.
        offline: 'Server Offline', // Status text when the server is offline.
      },
      status: {
        // Options: online, idle, dnd, invisible.
        online: 'online', // Bot status when the MC server is online.
        offline: 'idle', // Bot status when the MC server is offline.
      },
    },
  },
  mcserver: {
    ip: 'demo.mcstatus.io', // IP address of the MC server.
    port: 25565, // Port number of the MC server. Use Query Port in Java for the full player list.
    type: 'java', // Type of MC server: "java" or "bedrock".
    name: 'Demo Server', // Name of the MC server.
    version: 'Requires 1.8 - 1.20', // Version of the MC server.
    icon: 'https://i.imgur.com/6Msem8Q.png', // URL of the MC server icon. How to set it: https://tinyurl.com/iconurl
    site: 'https://nooberpro.gitbook.io/', // URL of the MC server or vote website. Leave blank to disable site commands.
  },

  // Bot settings.
  settings: {
    language: {
      // Available languages:
      // en (English), es (Spanish), de (German), fr (French), pt (Portuguese), ru (Russian), uk (Ukrainian), nl(Dutch)
      main: 'en', // Main language (files in ./translation/)
      // Optional language settings for specific features. Leave blank to use the main language.
      embeds: '', // Language for embeds, Slash and Prefix Commands, Auto Changing Status.
      autoReply: '', // Language for auto-reply feature responses.
      consoleLog: '', // Language for console log output.
      slashCmds: '', // Language for slash commands descriptions and error messages.
    },
    embedsColors: {
      basicCmds: 'Aqua', // Color for basic commands like version, site, ip.
      online: 'Green', // Color for commands when the server is online (e.g., status, players, motd).
      offline: 'Red', // Color for offline status embeds.
    },
    // Console logging settings.
    logging: {
      timezone: '', // Time zone for the bot. Use formats like America/New_York or Europe/London. Leave blank to use the bot's local time zone.
      inviteLink: true, // Log the invite link at the bot's launch.
      debug: false, // Log status messages and bot activity updates (may result in spam).
      error: true, // Log any errors that occur.
      serverInfo: true, // Log basic server info and check if it's online at startup.
    },
  },

  // Feature settings

  // Automatically updates the MC server status in a channel in real-time.
  autoChangeStatus: {
    enabled: false,
    updateInterval: 60, // Interval between status updates in seconds. Recommended: above 60.
    adminOnly: true, // It makes admins who with the "Manage Channel" permission can only set the status message.
    playerAvatarEmoji: false, // Show player avatar in the player list. Only for Java and in adminOnly mode.(beta)
    // These settings apply to slash (/) and prefix commands for status.
    isOnlineCheck: true, // Useful for servers using free hosting providers like Aternos. If the server's max players is 0, the status will be set to offline.
  },

  // Shows the player count of the MC server in the channel name.
  playerCountCH: {
    enabled: false,
    guildID: 'your-guild-id-here', // Server ID for creating/editing channel stats.
    channelId: '', // Channel ID for editing the player count. If no ID is provided, the bot will create the channel itself.
    // {playeronline} and {playermax} display the current and maximum number of players.
    onlineText: '🟢 {playeronline}/{playermax} active players',
    offlineText: '🔴 Offline', // Name set when the MC server is offline.
  },

  autoReply: {
    // If a message contains trigger words, reply with appropriate server information.
    enabled: false, // Disable the entire auto-reply feature.
    deleteMsg: true, // This will delete the trigger message sent by user and response of the bot after 10 sec. (Avoids clutter in chat)
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
    slashCommands: true, // Enables all slash commands.
    prefixCommands: {
      enabled: true, // Enables all prefix commands.
      prefix: '!', // Prefix for normal commands.
    },
    ip: {
      enabled: true, // Enables the IP command.
      alias: ['ip-address'], // Aliases for IP prefix commands.
    },
    site: {
      enabled: true, // Enables the site command.
      alias: ['vote', 'link'], // Aliases for site prefix commands.
    },
    version: {
      enabled: true, // Enables the version command.
      alias: [], // Aliases for version prefix commands.
    },
    players: {
      enabled: true, // Enables the players command.
      alias: ['plist'], // Aliases for players prefix commands.
    },
    status: {
      enabled: true, // Enables the status command.
      alias: [], // Aliases for status prefix commands.
    },
    motd: {
      enabled: true, // Enables the motd command.
      alias: [], // Aliases for motd prefix commands.
    },
    help: {
      enabled: true, // Enables the help command.
      alias: ['commands'], // Aliases for help prefix commands.
    },
  },
}

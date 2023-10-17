const config = {
    // Bot Owner, level 10 by default. A User ID. Should never be anything else than the bot owner's ID.
    "ownerID": "148131362736439297",

    // Bot Token
    "token": "OTcwMDM2OTg4OTI3NDI2NjIw.GqoprW.ClSD8Qd3qApyy_v8woIa9KAxc9nKhsiHApsieM",
    // Prefix for bot commands
    "prefix": "&",

    // Application Channel Settings
    "listener": "990251005503471655",
    "webhook_id": "1000140116234338335",

    // Google Form Settings
    "discord_tag": "DiscordName#1234",
    "character_server_name": "CharacterName-RealmName",
    "battle_tag": "Battletag",

    // Internal Category/Channel Settings
    "internal" : {
        "category": "1000847531430903818",
        "channel_prefix": "Internal-",
        // base ranks to give internal persmissions to
        "ranks": ["Officer"],
        // gives bots higher permissions than the above
        "bots": ["AppBot"]
    },

    // Open/Applicant Category/Channel Settings
    "open" : {
        "channel": "TRUE",
        "category": "1000843718070378507",
        "channel_prefix": "Open-",
        // base ranks to give internal persmissions to
        "ranks": ["Officer", "Applicant"],
        // gives bots higher permissions than the above
        "bots": ["AppBot"]
    },

	"auto_role" : {
		"enabled": "TRUE",
		"role": "Applicant"
	},

    "language": {
        "create_channel": {
            "reason": "New Application",
            "topic": "New Application by %user%"
        }
    }
  };

  module.exports = config;

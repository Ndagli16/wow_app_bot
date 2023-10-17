const config = {
    // Bot Owner, level 10 by default. A User ID. Should never be anything else than the bot owner's ID.
    "ownerID": "791138564007657502",

    // Bot Token
    "token": "MTAwMDQ5MDcxNjQyMzgwMjkxMA.Gt9Ln8.Vc4QkPVQTnAnlpJivK_XM8aCmrBNDkynVQ0JHw",
    // Prefix for bot commands
    "prefix": "&",

    // Application Channel Settings
    "listener": "970747056740261948",
    "webhook_id": "1000495458583580692",

    // Google Form Settings
    "discord_tag": "Discord Username",
    "character_server_name": "Character & Realm",
    "battle_tag": "BattleTag",

    // Internal Category/Channel Settings
    "internal" : {
        "category": "970746961772806224",
        "channel_prefix": "Internal-",
        // base ranks to give internal persmissions to
        "ranks": ["Discord Admin", "Officer", "Gilthridge"],
        // gives bots higher permissions than the above
        "bots": ["BOTS"]
    },

    // Open/Applicant Category/Channel Settings
    "open" : {
        "channel": "TRUE",
        "category": "970755840153890846",
        "channel_prefix": "Open-",
        // base ranks to give internal persmissions to
        "ranks": ["Discord Admin", "Officer", "Gilthridge"],
        // gives bots higher permissions than the above
        "bots": ["BOTS"]
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

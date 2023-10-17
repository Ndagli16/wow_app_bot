const Discord = require('discord.js')
const fs = require('fs')
const config = require('@root/config.js')

async function run (client, message) {
    const { author, guild } = message

    // EXTRACT DATA

    // Loops through embed fields to find specified character/realm and discord labels from config file.
    var fieldsLength = message.embeds[0].fields.length


     for (var i = 0; i < fieldsLength; i++) {
       if (message.embeds[0].fields[i].name == config.character_server_name) {
         // Gets the character and realm from the embed message the bot sends
         console.log("entered_func to get char server name")
         characterServerName = message.embeds[0].fields[i].value
         console.log(characterServerName)
       }
       if (message.embeds[0].fields[i].name == config.discord_tag) {
         // Gets the discord tag of the applicant and finds the user ID
         console.log("entered_func to get userTag")
         userTag = message.embeds[0].fields[i].value
         console.log(userTag)
       }
       if (message.embeds[0].fields[i].name == config.battle_tag) {
         // Applicants battle tag
         console.log("entered func to get battleTag")
         battleTag = message.embeds[0].fields[i].value
         console.log(battleTag)
       }
     }

    // Takes userTag from application and gets the user object
    // await guild.members.fetch()
    let userObj = client.users.cache.find(user => user.tag === userTag)

    console.log(userObj)
    console.log(client.users.cache)

    // Sets user.id. If they gave wrong discord tag or it cannot be found, this will send the error message to the log file
    if(userObj) {
      userObj = userObj.id
    } else {
      // Gets current date and time
      var date = Date()
      fs.appendFileSync('./logs/log.txt', 'Invalid Discord user tag, ' + userTag + ', for applicant ' + characterServerName + ' at ' + date + '\n')
    }

    // AUTO ROLE
    if(config.auto_role.enabled == "TRUE") {
      if(userObj) {
        var role = guild.roles.cache.find(role => role.name === config.auto_role.role);
        console.log("THIS IS THE ROLE")
        console.log(role)
        console.log("THIS IS THE END OF THE ROLE")
        guild.member(userObj).roles.add(role);
      }
    }

    // CHANNEL WORK

    // Checks to make sure internal category is set properly
    let internal_category = guild.channels.cache.get(process.env.INTERNAL_CATEGORY_ID || config.internal.category)
    if(!internal_category || !internal_category.type === 'category') {
        fs.appendFileSync('./logs/errorlog.txt', 'Internal category is not a valid category.')
        console.error('Internal category is not a valid category.')
        return
    }

    // Checks to make sure open category is set properly
    const open_category = guild.channels.cache.get(process.env.OPEN_CATEGORY_ID || config.open.category)
    /*
    if(!open_category || !open_category.type === 'category') {
        fs.appendFileSync('./errorlog.txt', 'Open category is not a valid category.');
        console.error('Open category is not a valid category.');
        return;
    }
    */

    // Sets the parent category if there is one set in config
    if(!open_category || !open_category.type === 'category') {
      fs.appendFileSync('./logs/errorlog.txt', 'Open category is invalid or not set in config. Placing Open applications in base discord channel.' + '\n')
      console.error('Open category is invalid or not set in config. Placing Open applications in base discord channel.')
    }

    // PERMISSIONS

    // Sets roles from config for rank setup
    // Internal ranks
    var iranks = []
    for (var i = 0; i < config.internal.ranks.length; i++) {
      iranks.push(message.guild.roles.cache.get(message.guild.id))
    }


    console.log("THIS IS THE BOT RANKS")
    // Internal bot ranks
    var iranksbots = []
    //console.log(config.internal.bots)
    //console.log(config.internal.bots.length)
    //console.log(message.guild.roles.cache)

    for (var i = 0; i < config.internal.bots.length; i++) {
     // console.log(message.guild.roles.cache.find(role => role.name === config.internal.bots[i]))

      iranksbots.push(message.guild.roles.cache.find(role => role.name === config.internal.bots[i]))
    }
    console.log("THIS IS THE END OF THE BOT RANKS")
    // Open ranks
    var oranks = []
    for (var i = 0; i < config.open.ranks.length; i++) {
      //oranks.push(message.guild.roles.cache.find(role => role.name === config.open.ranks[i]))
      oranks.push(message.guild.roles.cache.get(message.guild.id))
    }
    console.log("START OF ORANKS")
    console.log(oranks)
    console.log("END OF ORANKS")
    // Open bot ranks
    var oranksbots = []
    for (var i = 0; i < config.open.bots.length; i++) {
      oranksbots.push(message.guild.roles.cache.find(role => role.name === config.open.bots[i]))
    }

    let everyoneRole = message.guild.roles.cache.find(r => r.name === '@everyone');
    // Creates overwrites array for open channel creation
    const open_overwrites = [{
      // everyone
      id: everyoneRole.id,
      deny: ['VIEW_CHANNEL']
    },
    {
      // application-bot
      id: message.client.user.id,
      allow: ['SEND_MESSAGES','VIEW_CHANNEL','MANAGE_MESSAGES']
    },
    {
      // "Application"
      id: author,
      allow: ['SEND_MESSAGES','VIEW_CHANNEL']
    }]

    // config.open.CHANNEL = TRUE

    // If config.open.channel is set to TRUE in the config file, then this part will be run.
    // Sets conditonal permissions based on proper discord ID and user setings in config.
    if (config.open.channel == "TRUE") {
      // Conditonal based on if the user inputted a proper discord ID
      if(userObj) {
        open_overwrites.push({
          id: userObj,
          allow: ['SEND_MESSAGES','VIEW_CHANNEL']
        })
      }

      // Loops through open rank array and sets permissions.
      for (var i = 0; i < oranks.length; i++) {
        open_overwrites.push({
          id : oranks[i],
          allow: ['SEND_MESSAGES','VIEW_CHANNEL']
        })
      }

      // Loops through open bot ranks array and sets permissions.
      for (var i = 0; i < oranksbots.length; i++) {
        open_overwrites.push({
          id : oranksbots[i],
          allow: ['SEND_MESSAGES','VIEW_CHANNEL','MANAGE_MESSAGES']
        })
      }

    console.log("START OF OPEN OVERWRITES")
    console.log(open_overwrites)
    console.log("END OF OPEN OVERWRISTES")
      // Creates the open channel
      const openAppChannel = await guild.channels.create(config.open.channel_prefix + characterServerName, {
        type: 'text',
        permissionOverwrites: open_overwrites,
        parent: open_category.id,
        topic: config.language.create_channel.topic.replace('%user%', characterServerName)
      })

    if (!openAppChannel.parent){
        return console.log("this channel has no parent cat")
    }
    openAppChannel.lockPermissions()
        .then(() => console.log("succes on synching open cat perms"))
        .catch(console.error);

      // Copies the embed and sends to open app channel
      let openEmbed = await openAppChannel.send(new Discord.MessageEmbed(message.embeds[0]))

      // Gets current date and time
      var date = Date()

      fs.appendFileSync('./logs/log.txt', 'Applcation submitted for: ' + userTag + ' / ' + characterServerName + ' at ' + date + '\n', function (err) {
        if (err) {
          fs.appendFileSync('./logs/errorlog.txt', err + ' at ' + date + '\n')
          return console.log(err)
        }
      })

      // Prints error to their specific channel if they used incorrect discord tag
      if(!userObj) {
        // :x:
        openEmbed.react('❌')
        openAppChannel.send('Invalid Discord user tag, ' + userTag + ', for applicant ' + characterServerName + '. This could be due to the wrong discord tag or incorrect format of discord tag. It also may be due to that user not being cached yet. In which case you need to manually add the user to the channel permissions.')
      } else {
        // :ballot_box_with_check:
        // checkmark to show they gave proper discord id
        openEmbed.react('☑')
        openAppChannel.send(`Thank you for your interest in our guild, <@${userObj}>. Please monitor this channel for updates on your application.`)
      }
    }

    // INTERNAL PERMISSIONS

    // Creates overwrites array for internal channel creation
    const internal_overwrites = [{
      // everyone
      id: everyoneRole.id,
      deny: ['MANAGE_MESSAGES','VIEW_CHANNEL']
    },
    {
      // kammi-bot
      id: message.client.user.id,
      allow: ['SEND_MESSAGES','VIEW_CHANNEL','MANAGE_MESSAGES']
    },
    {
      // "Application"
      id: author,
      allow: ['SEND_MESSAGES','VIEW_CHANNEL']
    }]

    // Loops through internal rank array and sets permissions.
    for (var i = 0; i < iranks.length; i++) {
      internal_overwrites.push({
        id : iranks[i],
        allow: ['SEND_MESSAGES','VIEW_CHANNEL']
      })
    }

    // Loops through internal bot ranks array and sets permissions.
    for (var i = 0; i < iranksbots.length; i++) {
      internal_overwrites.push({
        id : iranksbots[i],
        allow: ['SEND_MESSAGES','VIEW_CHANNEL','MANAGE_MESSAGES']
      })
    }


    // INTERNAL CHANNEL

    // Creates the internal channel
    const internalAppChannel = await guild.channels.create(config.internal.channel_prefix + characterServerName, {
      type: 'text',
      permissionOverwrites: internal_overwrites,
      parent: internal_category.id,
      topic: config.language.create_channel.topic.replace('%user%', characterServerName)
    })

    if (!internalAppChannel.parent){
        return console.log("this channel has no parent cat")
    }
    internalAppChannel.lockPermissions()
        .then(() => console.log("succes on synching cat perms"))
        .catch(console.error);

    // MESSAGE SEND AND CLEAN UP

    // Copies embed and sends to internal app channel
    internalAppChannel.send(new Discord.MessageEmbed(message.embeds[0]))

    // Deletes message from original applications category
    // 1000 = 1 sec
    message.delete({ timeout: 1000})
}

module.exports = run

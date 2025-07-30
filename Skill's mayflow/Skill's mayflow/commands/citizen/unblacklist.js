const {Command} = require("discord.js-commando")

module.exports = class command extends Command {
    constructor(client) {
        super(client, {
            name: "unblacklist",
            group: "citizen",
            memberName: "unblacklist",
            description: "Remove a user from the citizen blacklist.",
            aliases: ["unblcitizen"],
            guildOnly: true,
            hidden: true,
            args: [{
                type: "string",
                prompt: "What is the Roblox username?",
                key: "Username",
            }]
        })
    }

    hasPermission(message) {
        if (message.guild.id == MainServer) {
            if (message.member.roles.cache.find(role => role.name == "Admin")) {
                return true;
            } else if ( message.member.roles.cache.find(role => role.name == "ICF Director")) {
                return true;
            } else {
                return ("Sorry :persevere:! You must be a Mayflower Admin or the head of ICF!")
            }
        } else {
            return ("Sorry :persevere:! You must use this command in the State of Mayflower!")
        }
    }

    async run(message, {
        Username
    }) {
        let RobloxUserExist = true

        const RobloxUserId = await Roblox.getIdFromUsername(Username).catch(error => {
            RobloxUserExist = false
            return message.reply("Sorry :persevere:! That doesn't appear to be a valid Roblox username!")
        })

        if (RobloxUserExist == true) {
            global.MongooseData.GetStorage('blacklisted.js').findOne({Identifier: message.author.id}, (err, Result) => {
                if (Result && Result.Blacklisted == null || !Result) {
                    global.MongooseData.SaveStorage('blacklisted.js', message.author.id, {
                        Identifier: message.author.id,
                        Blacklisted: false
                    }).then(() => {
                        message.channel.send("All done :blush:! `" + Username + "` has been removed from the blacklist!")
                    }).catch(error => {})
                } else if (Result && Result.Blacklisted == false) {
                    message.channel.send("`" + Username + "` isn't currently blacklisted!")
                } else {
                    global.MongooseData.SaveStorage('blacklisted.js', message.author.id, {
                        Identifier: message.author.id,
                        Blacklisted: false
                    }).then(() => {
                        message.channel.send("All done :blush:! `" + Username + "` has been removed from the blacklist!")
                    }).catch(error => {})
                }
            })
        }
    }
}

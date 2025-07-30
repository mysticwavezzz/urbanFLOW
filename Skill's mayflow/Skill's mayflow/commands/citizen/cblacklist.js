const {Command} = require("discord.js-commando")

module.exports = class command extends Command {
    constructor(client) {
        super(client, {
            name: "cblacklist",
            group: "citizen",
            memberName: "cblacklist",
            description: "Checks a user's blacklist status.",
            aliases: ["cblcitizen"],
            guildOnly: true,
            hidden: true,
            args: [{
                type: "string",
                prompt: "What is the Roblox username?",
                key: "username",
            }]
        })
    }

    hasPermission(message) {
        if (message.guild.id == MainServer) {
            if (message.member.roles.cache.find(role => role.name == "Admin")) {
                return true;
            } else if ( message.member.roles.cache.find(role => role.name == "ICF")) {
                return true;
            } else {
                return ("Sorry :persevere:! You must be a member of ICF!")
            }
        } else {
            return ("Sorry :persevere:! You must use this command in the State of Mayflower!")
        }
    }

    async run(message, {
        username
    }) {
        let RobloxUserExist = true

        const RobloxUserId = await Roblox.getIdFromUsername(username).catch(error => {
            RobloxUserExist = false
            return message.reply("Sorry :persevere:! That doesn't appear to be a valid Roblox username!")
        })

        if (RobloxUserExist == true) {
            global.MongooseData.GetStorage('blacklisted.js').findOne({Identifier: message.author.id}, (err, Result) => {
                if (Result && Result.Blacklisted == null || !Result) {
                    message.channel.send("`" + username + "` is **not** currently blacklisted.")
                } else if (Result && Result.Blacklisted == false) {
                    message.channel.send("`" + username + "` is **not** currently blacklisted.")
                } else {
                    message.channel.send("`" + username + "` is currently blacklisted.")
                }
            })
        }
    }
}

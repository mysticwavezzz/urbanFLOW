const {Command} = require("discord.js-commando")

module.exports = class command extends Command {
    constructor(client) {
        super(client, {
            name: "rolypoly",
            group: "citizen",
            memberName: "rolypoly",
            description: "",
            guildOnly: true,
            hidden: true,
            throttling: {
              usages: 2, 
              duration: 15, 
            },
            args: [
              {
                type: "string",
                prompt: "What is the Roblox userid?",
                key: "argUserId",
              },
              {
                type: "string",
                prompt: "What is the Roblox username?",
                key: "argUsername",
              }
            ]
        })
    }

    hasPermission(message) {
        if (message.guild.id == MainServer) {
            if (message.member.roles.cache.find(role => role.name == "Admin")) {
                return true;
            } else if ( message.member.roles.cache.find(role => role.name == "ICF Director")) {
                return true;
            } else {
                return ("Sorry :persevere:! You must be a https://cdn.frankerfacez.com/emoticon/42660/1")
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
            return message.reply("Invalid Roblox username!")
        })

        const RobloxUsername = await Roblox.getUsernameFromId(RobloxUserId)

        if (RobloxUserExist == true) {
            const rankLogs = await Roblox.getAuditLog(1, "ChangeRank", RobloxUserId, "Asc")
        }
    }
}
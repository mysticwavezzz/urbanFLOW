const {Command} = require("discord.js-commando")

module.exports = class command extends Command {
    constructor(client) {
        super(client, {
            name: "auditlogs",
            description: "Gets audit logs related to a Roblox user.",
            aliases: ["getlogs", "logs"],
            group: "citizen",
            memberName: "auditlogs",
            guildOnly: true,
            hidden: true,
            throttling: {
              usages: 2, 
              duration: 15, 
            },
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
            return message.reply("Invalid Roblox username!")
        })

        const RobloxUsername = await Roblox.getUsernameFromId(RobloxUserId)

        if (RobloxUserExist == true) {
            const rankLogs = await Roblox.getAuditLog(1, "ChangeRank", RobloxUserId, "Asc")
        }
    }
}
const {Command} = require("discord.js-commando")

module.exports = class command extends Command {
    constructor(client) {
        super(client, {
            name: "uban",
            group: "admin",
            memberName: "uban",
            description: "Bans a user from all Discords",
            aliases: ["ultraban", "bigban"],
            guildOnly: true,
            hidden: true,
            args: [
                {
                    type: "user",
                    prompt: "Which user are you trying to uban?",
                    key: "argUser",
                }, {
                    type: "string",
                    prompt: "What is the reason for ultra banning this user?",
                    key: "reason"
                }
            ]
        })
    }

    hasPermission(message) {
        if (message.guild.id == MainServer) {
            if (message.member.roles.cache.find(role => role.name == "Admin")) {
                return true;
            } else {
                return ("Sorry :persevere:! You must be a Admin!")
            }
        } else {
            return ("Sorry :persevere:! You must use this command in the State of Mayflower!")
        }
    }

    async run(message, {argUser, reason}) {
        
    }
}
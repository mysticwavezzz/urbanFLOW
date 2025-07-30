const {Command} = require("discord.js-commando")

module.exports = class command extends Command {
    constructor(client) {
        super(client, {
            name: "unuban",
            group: "admin",
            memberName: "unuban",
            description: "Unbans a user from all Discords",
            guildOnly: true,
            hidden: true,
            args: [
                {
                    type: "user",
                    prompt: "Which user are you trying to unuban?",
                    key: "argUser"
                }, {
                    type: "string",
                    prompt: "What is the reason for ultra unbanning this user?",
                    key: "reason",
                    default: "No Reason Provided"
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

    async run(message, {argUser,reason}) {
        
    }
}
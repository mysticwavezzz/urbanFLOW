const {Command} = require("discord.js-commando")

module.exports = class command extends Command {
    constructor(client) {
        super(client, {
            name: "checkelection",
            group: "misc",
            memberName: "checkelection",
            description: "Checks all valid election campaigning channels for rule violations.",
            guildOnly: true,
            hidden: true,
        })
    }

    hasPermission(message) {
        if (message.guild.id == MainServer) {
            if (message.member.roles.cache.find(role => role.name == "Admin")) {
                return true;
             } else {
                return ("Sorry :persevere:! You must be a member of the Mayflower Electoral Commission!")
            }
        } else {
            return ("Sorry :persevere:! You must use this command in the State of Mayflower!")
        }
    }

    async run(message) {
        
    }
}
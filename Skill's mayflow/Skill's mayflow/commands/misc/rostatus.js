const {Command} = require("discord.js-commando")

module.exports = class command extends Command {
    constructor(client) {
        super(client, {
            name: "rostatus",
            group: "misc",
            memberName: "rostatus",
            aliases: ["status"],
            description: "Retrieves details around the current Roblox account.",
            guildOnly: true,
            hidden: true,
            ownerOnly: true,
        })
    }

    hasPermission(message) {
        if (message.guild.id !== MainServer) {
            return ("Sorry :persevere:! You must use this command in the State of Mayflower!")
        }
    }

    async run(message) {
        
    }
}
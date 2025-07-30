const {Command} = require("discord.js-commando")

module.exports = class command extends Command {
    constructor(client) {
        super(client, {
            name: "mascot",
            description: "lord duncan",
            aliases: ["duncan","lordduncan"],
            group: "misc",
            memberName: "mascot",
            guildOnly: true,
            hidden: true,
            throttling: {
              usages: 2, 
              duration: 15, 
            },
        })
    }

    hasPermission(message) {
        if (message.guild.id == MSPServer) {
            return true
        } else {
            if (message.member.roles.cache.find(role => role.name == "Admin")) {
                return true;
            } else {
                return ("Sorry :persevere:! You must use this command in the Mayflower State Police server!")
            }
        }
    }

    async run(message) {
        if (message.guild.id !== MSPServer) {
            const MessageSent = await message.channel.send("lord duncan flexes the new MSP protection suit", {
                files: ["https://cdn.discordapp.com/attachments/348543842045263893/882304640434204712/duncan.png"]
            })

            MessageSent.react("😩")
            MessageSent.react("🇩")
            MessageSent.react("🇺")
            MessageSent.react("🇳")
            MessageSent.react("🇰")
            MessageSent.react("😤")
        } else {
            const MessageSent = await message.channel.send("Following a heated debate it has been decided by Mayflower State Police High Command (steven) that Lord Duncan will become the State Police's official mascot", {
                files: ["https://cdn.discordapp.com/attachments/398836343372775429/547555190157606947/duncan6.png"]
            })

            MessageSent.react("😩")
            MessageSent.react("🇩")
            MessageSent.react("🇺")
            MessageSent.react("🇳")
            MessageSent.react("🇰")
            MessageSent.react("😤")
        }
    }
}
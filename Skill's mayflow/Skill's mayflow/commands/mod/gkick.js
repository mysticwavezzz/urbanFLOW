const {Command} = require("discord.js-commando")

module.exports = class command extends Command {
    constructor(client) {
        super(client, {
            name: "gkick",
            group: "mod",
            memberName: "gkick",
            description: "Kicks a user from New Haven County",
            aliases: ["gamekick", "remotekick"],
            guildOnly: true,
            hidden: true,
            args: [{
                    type: "string",
                    prompt: "What is the Roblox username?",
                    key: "username"
                },
                {
                    type: "string",
                    prompt: "What is the reason for moderating this user?",
                    key: "reason"
                }
            ]
        });
    }

    hasPermission(message) {
        if (message.guild.id == MainServer) {
            if (message.member.roles.cache.find(role => role.name == "Admin")) {
                return true;
            } else if ( message.member.roles.cache.find(role => role.name == "Moderator")) {
                return true;
            } else {
                return ("Sorry :persevere:! You must be a Moderator or Admin!")
            }
        } else {
            return ("Sorry :persevere:! You must use this command in the State of Mayflower!")
        }
    }

    async run(message, {
        username,
        reason
    }) {
        let CanProcessCommand = true
        const MessageReply = await message.reply("Niiice! Let's kick `"+username+"`!")
        const PlayerId = await Roblox.getIdFromUsername(username).catch(error => {CanProcessCommand = false, MessageReply.edit("Sorry :persevere:! You haven't entered a valid Roblox username!")})
        const ExecutorData = await Request({uri: `https://verify.eryn.io/api/user/${message.author.id}`,json: true,simple: false})

        if (CanProcessCommand == true) {
            message.client.request = {
                CommandProcessed: false,
                MessageObject: MessageReply,
                AuthorId: message.author.id,
                CommandData: {Executor: ExecutorData.robloxId, Type: "Kick", Reason: reason, Player: PlayerId},
            }
    
            return
        }
    }
}
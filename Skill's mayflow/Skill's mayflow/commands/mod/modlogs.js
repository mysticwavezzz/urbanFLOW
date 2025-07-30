const {Command} = require("discord.js-commando")

module.exports = class command extends Command {
    constructor(client) {
        super(client, {
            name: "modlogs",
            group: "mod",
            memberName: "modlogs",
            description: "",
            aliases: ["modlog"],
            guildOnly: true,
            hidden: true,
            args: [{
                    type: "string",
                    prompt: "What is the Roblox username?",
                    key: "username"
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
        username
    }) {
        let CanProcessCommand = true
        const MessageReply = await message.reply("Niiice! Let's check `"+username+"`'s logs!")
        const PlayerId = await Roblox.getIdFromUsername(username).catch(error => {CanProcessCommand = false, MessageReply.edit("Sorry :persevere:! You haven't entered a valid Roblox username!")})
        const ExecutorData = await Request({uri: `https://verify.eryn.io/api/user/${message.author.id}`,json: true,simple: false})

        if (CanProcessCommand == true) {
            MessageReply.edit("Here are your results for `"+username+"`:")
            
            message.client.request = {
                CommandProcessed: false,
                MessageObject: MessageReply,
                AuthorId: message.author.id,
                CommandData: {Executor: ExecutorData.robloxId, Type: "Modlogs", Player: PlayerId},
            }
    
            return
        }
    }
}
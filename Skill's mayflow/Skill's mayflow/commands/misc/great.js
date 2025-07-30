const {Command} = require("discord.js-commando")

module.exports = class command extends Command {
    constructor(client) {
        super(client, {
            name: "great",
            group: "misc",
            memberName: "great",
            description: "Find a random #great-logs meassage",
            guildOnly: true,
            throttling: {
              usages: 2, 
              duration: 15, 
            },
        })
    }

    hasPermission(message) {
        if (message.guild.id == MainServer) {
            if (message.channel.id == BotCommands) {
                if (message.member.roles.cache.find(role => role.name == "McDoogle Premium")) {
                    return true
                } else if (message.member.roles.cache.find(role => role.name == "Veteran")) {
                    return true
                } else if (message.member.roles.cache.find(role => role.name == "ICF")) {
                    return true
                } else if (message.member.roles.cache.find(role => role.name == "Moderator")) {
                    return true
                } else if (message.member.roles.cache.find(role => role.name == "Admin")) {
                    return true
                } else {
                  return ("Sorry :persevere:! You must have Disposable Income, Veteran, ICF, Moderator and/or Admin roles!")
                }
            } else {
                return ("Sorry :persevere:! You must use this in <#"+ BotCommands +">!")
            }
        } else {
            return ("Sorry :persevere:! You must use this command in the State of Mayflower!")
        }
    }

    async run(message) {
        let BotCommandsChannel = message.client.channels.cache.get(GreatChannel)

        BotCommandsChannel
            .messages.fetch()
            .then(messages => {
                let RandomMessage = messages.random();

                if (!RandomMessage) {
                    return message.reply("Sorry :persevere:! I couldn't find anything in #great-logs!")
                } else {
                    let RandomMessageTimeStamp = new Date(RandomMessage.createdTimestamp);
                    let RandomMessageDate = RandomMessageTimeStamp.toDateString();

                    if (RandomMessage.attachments) {
                        let attachmenturl
                        RandomMessage.attachments.forEach(Attachment => {
                            attachmenturl = Attachment.url
                        })

                        message.reply(
                            `<#${GreatChannel}> - ${RandomMessageDate}:\n${RandomMessage.content}`, {
                                files: [attachmenturl]
                            }
                        );
                    } else {
                        message.reply(
                            `<#${GreatChannel}> - ${RandomMessageDate}:\n${RandomMessage.content}`
                        );
                    }
                }
            }).catch(console.error)
    }
}

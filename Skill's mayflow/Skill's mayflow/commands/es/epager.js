const {Command} = require("discord.js-commando")
const Discord = require("discord.js")

module.exports = class command extends Command {
    constructor(client) {
        super(client, {
            name: "epager",
            group: "es",
            memberName: "epager",
            description: "Edits a user's most recent pager.",
            aliases: ["editpager", "epage", "editpage"],
            guildOnly: true,
            args: [{
                type: "string",
                prompt: "What is the pager about?",
                key: "reason"
            }]
        })
    }

    hasPermission(message) {
        if (message.guild.id == MainServer) {
            if (message.channel.id == EsGeneral) {
                if (message.member.roles.cache.find(role => role.name == "Admin")) {
                    return true;
                } else if ( message.member.roles.cache.find(role => role.name == "Moderator")) {
                    return true;
                } else if ( message.member.roles.cache.find(role => role.name == "NGMP")) {
                    return true;
                } else if ( message.member.roles.cache.find(role => role.name == "PPD")) {
                    return true;
                } else if ( message.member.roles.cache.find(role => role.name == "NHCSO")) {
                    return true;
                } else if ( message.member.roles.cache.find(role => role.name == "MSP")) {
                    return true;
                } else if ( message.member.roles.cache.find(role => role.name == "LPD")) {
                    return true;
                } else {
                    return ("Sorry :persevere:! You must have LPD, MSP, NHCSO, PPD, NGMP, Moderator and/or Admin roles!")
                }
            } else {
                return ("Sorry :persevere:! You must use this in <#"+ EsGeneral +">!")
            }
        } else {
            return ("Sorry :persevere:! You must use this command in the State of Mayflower!")
        }
    }

    async run(message, {
        reason
    }) {
        let RobloxInfo = await Request({
            uri: `https://verify.eryn.io/api/user/${message.author.id}`,
            json: true,
            simple: false
        })

        global.MongooseData.GetStorage('pager.js').findOne({Identifier: message.author.id}, (err, Result) => {
            if (!Result || Result && Result.pagerid == '0') {
                return message.reply("Sorry :persevere:! You don't have any active pagers.");
            } else {
                const Embed = new Discord.MessageEmbed()
                    .setAuthor(message.member.displayName)
                    .setTitle("Edited Pager!")
                    .setDescription(reason)
                    .addField(
                        "Links",
                        `[Roblox Profile](https://www.roblox.com/users/${RobloxInfo.robloxId}/profile)\n\[Game Link](https://www.roblox.com/games/${RobloxGameId}/New-Haven-County)`
                    )
                    .setTimestamp()
                    .setColor("RED")

                let PagerChannel = message.client.channels.cache.get(Pager)

                PagerChannel.messages.fetch(Result.pagerid).then(OldPager => {
                    if (OldPager) {
                        OldPager.edit(Embed)
                    }
                })

                return message.reply("Cheers! I've Successfully edited your pager.")
            }
        })
    }
}

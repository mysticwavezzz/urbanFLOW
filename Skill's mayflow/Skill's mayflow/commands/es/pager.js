const {Command} = require("discord.js-commando")
const Discord = require("discord.js")

module.exports = class command extends Command {
    constructor(client) {
        super(client, {
            name: "pager",
            group: "es",
            memberName: "pager",
            description: "Sends an alert to the pager.",
            aliases: ["page"],
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

        let RobloxUserData = await Request({
            uri: `https://api.roblox.com/users/${RobloxInfo.robloxId}/onlinestatus/`,
            json: true,
            simple: false
        })

        if (RobloxUserData.LocationType !== 4) {
            return message.reply("You're not playing New Haven County right now..?")
        } else {
            global.MongooseData.GetStorage('pager.js').findOne({Identifier: message.author.id}, (err, Result) => {
                if (!Result || Result && Result.pagerid == '0') {
                    let PagerChannel = message.client.channels.cache.get(Pager)

                    PagerChannel.send("here").then(PagerMessage => {
                        let Embed = new Discord.MessageEmbed()
                            .setAuthor(message.member.displayName)
                            .setTitle("New Pager!")
                            .setDescription(reason)
                            .addField(
                                "Links",
                                `[Roblox Profile](https://www.roblox.com/users/${RobloxInfo.robloxId}/profile)\n\[New Haven County](https://www.roblox.com/games/${RobloxGameId}/New-Haven-County)`
                            )
                            .setTimestamp()
                            .setColor("RED")

                        PagerChannel.send(Embed).then(NewPagerMessage => {
                            NewPagerMessage.react("✅")

                            message.reply("Cheers! That's now in <#" + Pager + ">...")

                            global.MongooseData.SaveStorage('pager.js', message.author.id, {
                                Identifier: message.author.id,
                                pagerid: NewPagerMessage.id,
                                pagertagid: PagerMessage.id,
                            }) 

                            setTimeout(() => {
                                NewPagerMessage.delete()
                                PagerMessage.delete()
                            }, 900000)
                        })
                    })
                } else {
                    return message.reply("You can't create a new pager when you already have one active!")
                }
            })
        }
    }
}

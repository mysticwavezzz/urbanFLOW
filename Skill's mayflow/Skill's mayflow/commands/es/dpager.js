const {Command} = require("discord.js-commando")
const Discord = require("discord.js")

module.exports = class command extends Command {
    constructor(client) {
        super(client, {
            name: "dpager",
            group: "es",
            memberName: "dpager",
            description: "Deletes a user's post from pagers",
            aliases: ["delpager", "delpage", "dpage"],
            guildOnly: true,
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

    async run(message, {}) {
        global.MongooseData.GetStorage('pager.js').findOne({Identifier: message.author.id}, (err, Result) => {
            if (!Result || Result && Result.pagerid == '0') {
                return message.reply("Sorry :persevere:! You don't have any active pagers.");
            } else {
                let PagerChannel = message.client.channels.cache.get(Pager)

                PagerChannel.messages.fetch(Result.pagerid).then(OldPager => {
                    if (OldPager) {
                        OldPager.delete()
                    }
                })

                PagerChannel.messages.fetch(Result.pagertagid).then(OldPager => {
                    if (OldPager) {
                        OldPager.delete()
                    }
                })

                global.MongooseData.SaveStorage('pager.js', message.author.id, {
                    Identifier: message.author.id,
                    pagertagid: '0',
                    pagerid: '0',
                })

                return message.reply("Deleted all pagers from you!")
            }
        })
    }
}

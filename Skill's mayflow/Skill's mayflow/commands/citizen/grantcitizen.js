const {Command} = require("discord.js-commando")
const { MessageEmbed } = require('discord.js')
const Discord = require("discord.js")

module.exports = class command extends Command {
    constructor(client) {
        super(client, {
            name: "grantcitizen",
            group: "citizen",
            memberName: "grantcitizen",
            description: "Promotes user to Citizen.",
            aliases: ["gcitizen", "citizen"],
            guildOnly: true,
            hidden: true,
            args: [{
                type: "string",
                prompt: "What is the Roblox username?",
                key: "username",
            }]
        })
    }

    hasPermission(message) {
        if (message.guild.id == MainServer) {
            if (message.member.roles.cache.find(role => role.name == "Admin")) {
                return true;
            } else if ( message.member.roles.cache.find(role => role.name == "ICF")) {
                return true;
            } else {
                return ("Sorry :persevere:! You must be a member of ICF!")
            }
        } else {
            return ("Sorry :persevere:! You must use this command in the State of Mayflower!")
        }
    }

    async run(message, {
        username
    }) {
        let RobloxUserExist = true

        const RobloxUserId = await Roblox.getIdFromUsername(username).catch(error => {
            RobloxUserExist = false
            return message.reply("Invalid Roblox username!")
        })

        const RobloxUsername = await Roblox.getUsernameFromId(RobloxUserId)

        let RobloxUserGroupData = await Request({
            uri: `https://groups.roblox.com/v2/users/${RobloxUserId}/groups/roles`,
            json: true,
            simple: false
        })

        var ChoiceSelected;

        let RanCommand = false
        let CanRun = false

        const EmbedMessage = new MessageEmbed()
            .setTitle(RobloxUsername + "'s Citizenship Appeal")
            .setDescription('Choose the correct option using the reactions below once all have appeared.')
            .addFields({
                "name": "🇦",
                "value": "Accepted"
            }, {
                "name": "🇩",
                "value": "Denied"
            }, {
                "name": "🇵",
                "value": "Inventory Private"
            }, {
                "name": "🇳",
                "value": "Not in Mayflower"
            }, {
                "name": "🇨",
                "value": "Already Citizen"
            }, {
                "name": "🇹",
                "value": "Denied [PNG]"
            }, )

        const NewMessage = await message.channel.send(EmbedMessage)

        NewMessage.react("🇦")
        NewMessage.react("🇩")
        NewMessage.react("🇵")
        NewMessage.react("🇳")
        NewMessage.react("🇨")
        NewMessage.react("🇹")

        const filter = (reaction, user2) => {
            if (
                reaction.emoji.name === "🇦" && user2.id === message.author.id && reaction.message === NewMessage && RanCommand == false) {
                RanCommand = true
                CanRun = true

                ChoiceSelected = "Accepted";
            } else if (
                reaction.emoji.name === "🇩" && user2.id === message.author.id && reaction.message === NewMessage && RanCommand == false) {
                RanCommand = true
                CanRun = true

                ChoiceSelected = "Denied";
            } else if (
                reaction.emoji.name === "🇵" && user2.id === message.author.id && reaction.message === NewMessage && RanCommand == false) {
                RanCommand = true
                CanRun = true

                ChoiceSelected = "Inventory Private";
            } else if (
                reaction.emoji.name === "🇳" && user2.id === message.author.id && reaction.message === NewMessage && RanCommand == false) {
                RanCommand = true
                CanRun = true

                ChoiceSelected = "Not in Mayflower";
            } else if (
                reaction.emoji.name === "🇨" && user2.id === message.author.id && reaction.message === NewMessage && RanCommand == false) {
                RanCommand = true
                CanRun = true

                ChoiceSelected = "Already Citizen";
            } else if (
                reaction.emoji.name === "🇹" && user2.id === message.author.id && reaction.message === NewMessage && RanCommand == false) {
                RanCommand = true
                CanRun = true

                ChoiceSelected = "Denied [PNG]";
            }

            if (CanRun == true) {
                NewMessage.delete()

                if (RobloxUserExist == true) {
                    let IsBlacklisted = false
                    let Check1 = true

                    if (ChoiceSelected == "Accepted") {
                        let IsInGroup = false
                        let UserRankId

                        RobloxUserGroupData.data.forEach(Data => {
                            if (Data.group.id == RobloxGroupId) {
                                IsInGroup = true
                                UserRankId = Data.role.rank
                            }
                        })

                        if (IsInGroup == false) {
                            Check1 = false
                            return message.reply("An error has occurred while promoting this user, are they in the group?")
                        }

                        if (UserRankId !== 1) {
                            Check1 = false
                            return message.reply("An error has occurred while promoting this user, they are already ranked citizen or higher!")
                        }

                        global.MongooseData.GetStorage('blacklisted.js').findOne({Identifier: message.author.id}, (err, Result) => {
                            if (Check1 == true) {
                                if (Result && Result.Blacklisted == null || !Result) {
                                    message.channel.send("Successfully granted citizenship to `" + RobloxUsername + "`!")
                                } else if (Result && Result.Blacklisted == false) {
                                    message.channel.send("Successfully granted citizenship to `" + RobloxUsername + "`!")
                                } else {
                                    IsBlacklisted = true
                                    return message.channel.send("`" + RobloxUsername + "` is currently blacklisted.")
                                }
                            }
                        })

                    } else {
                        message.channel.send("Successfully denied citizenship to `" + RobloxUsername + "`!")
                    }

                    setTimeout(() => {

                        if (IsBlacklisted === false) {
                            if (ChoiceSelected == "Accepted") {
                                if (Check1 === true) {
                                    Roblox.setRank(RobloxGroupId, RobloxUserId, 52)
                                }
                            }

                            if (Check1 === true) {
                                var Webhook = new Discord.WebhookClient(
                                    "1003354818070446180",
                                    "cJgNvaT5ZAdMzAZSQFyH3K7Jxl6-5UxpT4GQi0FmdJxpwMiFw2yjfMboQAhQ7pXxpWlq"
                                );

                                const Embed = new Discord.MessageEmbed()
                                    .setTitle(`${RobloxUsername}'s Citizenship Appeal`)
                                    .setDescription(ChoiceSelected);
                                Webhook.send("", {
                                    username: "Citizenship",
                                    embeds: [Embed]
                                });
                            }
                        }

                    }, require("ms")("1s"))
                }
            }
        }

        NewMessage.awaitReactions(filter, {});
    }
}

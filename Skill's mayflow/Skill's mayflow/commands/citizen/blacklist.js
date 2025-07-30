const {Command} = require("discord.js-commando")

module.exports = class command extends Command {
    constructor(client) {
        super(client, {
            name: "blacklist",
            group: "citizen",
            memberName: "blacklist",
            description: "Adds a user to the citizen blacklist.",
            aliases: ["blcitizen"],
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
            } else if ( message.member.roles.cache.find(role => role.name == "ICF Director")) {
                return true;
            } else {
                return ("Sorry :persevere:! You must be a Mayflower Admin or the head of ICF!")
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
            return message.reply("Sorry :persevere:! That doesn't appear to be a valid Roblox username!")
        })

        let RobloxUserGroupData = await Request({
            uri: `https://groups.roblox.com/v2/users/${RobloxUserId}/groups/roles`,
            json: true,
            simple: false
        })

        if (RobloxUserExist == true) {
            global.MongooseData.GetStorage('blacklisted.js').findOne({Identifier: message.author.id}, (err, Result) => {
                if (Result && Result.Blacklisted == null || !Result) {
                    global.MongooseData.SaveStorage('blacklisted.js', message.author.id, {
                        Identifier: message.author.id,
                        Blacklisted: true
                    }).then(() => {
                        let IsInGroup = false
                        let UserRankId

                        RobloxUserGroupData.data.forEach(Data => {
                            if (Data.group.id == RobloxGroupId) {
                                IsInGroup = true
                                UserRankId = Data.role.rank
                            }
                        })

                        if (IsInGroup == false) {
                            return message.channel.send("All done :blush:! `" + username + "` has been added to the blacklist!")
                        }

                        if (UserRankId !== 1) {
                            return message.channel.send("All done :blush:! `" + username + "` has been added to the blacklist and demoted!")
                        } else {
                            return message.channel.send("All done :blush:! `" + username + "` has been added to the blacklist!")
                        }
                    }).catch(error => {
                        sendError(error)
                    })
                } else if (Result && Result.Blacklisted == false) {
                    global.MongooseData.SaveStorage('blacklisted.js', message.author.id, {
                        Identifier: message.author.id,
                        Blacklisted: true
                    }).then(() => {
                        let IsInGroup = false
                        let UserRankId

                        RobloxUserGroupData.data.forEach(Data => {
                            if (Data.group.id == RobloxGroupId) {
                                IsInGroup = true
                                UserRankId = Data.role.rank
                            }
                        })

                        if (IsInGroup == false) {
                            return message.channel.send("All done :blush:! `" + username + "` has been added to the blacklist!")
                        }

                        if (UserRankId !== 1) {
                            return message.channel.send("All done :blush:! `" + username + "` has been added to the blacklist and demoted!")
                        } else {
                            return message.channel.send("All done :blush:! `" + username + "` has been added to the blacklist!")
                        }
                    }).catch(error => {
                        sendError(error)
                    })
                } else {
                    return message.channel.send("`" + username + "` has already been blacklisted!")
                }
            })

            await Roblox.setCookie(RobloxCookie).catch(async err => {
                console.log('Issue with logging in: ' + err);
            });

            await Roblox.setRank(RobloxGroupId, RobloxUserId, 1).catch(async err => {});
        }
    }
}

const {Command} = require("discord.js-commando")

module.exports = class command extends Command {
    constructor(client) {
        super(client, {
            name: "revokecitizen",
            description: "Demotes user to Tourist.",
            aliases: ["rcitizen", "dcitizen"],
            group: "citizen",
            memberName: "revokecitizen",
            guildOnly: true,
            hidden: true,
            throttling: {
              usages: 2, 
              duration: 15, 
            },
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

        if (RobloxUserExist == true) {
            let IsBlacklisted = false
            let Check1 = true

            Roblox.setCookie(RobloxCookie).catch(err => {
                console.log('Issue with logging in: ' + err);
                Check1 = false
            });

            let RobloxUserGroupData = await Request({
                uri: `https://groups.roblox.com/v2/users/${RobloxUserId}/groups/roles`,
                json: true,
                simple: false
            })

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
                return message.reply("Sorry :persevere:! This Roblox user is not currently in the State of Mayflower group!")
            }

            if (UserRankId == 1) {
                Check1 = false
                return message.reply("Sorry :persevere:! This Roblox user hasn't obtained citizenship!")
            }

            if (UserRankId > 52) {
                Check1 = false
                return message.reply("Sorry :persevere:! This Roblox user is already ranked a role higher than citizen!")
            }

            if (Check1 == true) {
                Roblox.setRank(RobloxGroupId, RobloxUserId, 1)

                return message.reply("Successfully revoked citizenship from `" + RobloxUsername + "`")
            }
        }
    }
}

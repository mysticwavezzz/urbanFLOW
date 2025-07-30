const {Command} = require("discord.js-commando")
const Discord = require("discord.js")

module.exports = class command extends Command {
    constructor(client) {
        super(client, {
            name: "getserver",
            group: "mod",
            memberName: "getserver",
            description: "Retrieves information about a given player's server",
            aliases: ["gserver", "gameserver", "server"],
            guildOnly: true,
            hidden: true,
            args: [{
                type: "string",
                key: "username",
                default: "",
                prompt: "",
            }]
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
        let GlobalData = await Request({
            uri: `https://games.roblox.com/v1/games/${RobloxGameId}/servers/Public?sortOrder=Asc&limit=100`,
            json: true,
            simple: false
        }).catch(err => {
            return message.reply("Sorry :persevere:! I had trouble requesting that! Please try again later!")
        })

        let TotalServers = 0

        GlobalData.data.forEach(Data => {
            TotalServers = TotalServers + 1
        })

        if (username) {
            const PlayerId = await Roblox.getIdFromUsername(username).catch(error => {})
            let GlobalConstants
            let ServerFound

            if (!PlayerId) {
                RunningServers.forEach(ServerData => {
                    if (ServerData.jobid == username) {
                        ServerFound = ServerData
                        GlobalData.data.forEach(Data => {
                            if (Data.id == ServerData.jobid) {
                                GlobalConstants = Data
                            }
                        })
                    }
                })
            } else {
                RunningServers.forEach(ServerData => {
                    ServerData.players.forEach(argPlayerId => {
                        if (argPlayerId == PlayerId) {
                            ServerFound = ServerData
                            GlobalData.data.forEach(Data => {
                                if (Data.id == ServerData.jobid) {
                                    GlobalConstants = Data
                                }
                            })
                        }
                    })
                })
            }

            if (!ServerFound) {
                if (PlayerId) {
                  message.reply("Sorry :persevere:! This Roblox user is not currently in New Haven County!")
                } else {
                  message.reply("Sorry :persevere:! This server does not exist!")
                }
            } else {
                let TotalPlayers = 0
                let PlayerList1 = []
                let PlayerList2 = []

                ServerFound.players.forEach(argPlayerId => {
                    TotalPlayers = TotalPlayers + 1
                    if (TotalPlayers > 25) {
                        PlayerList2.push(argPlayerId)
                    } else {
                        PlayerList1.push(argPlayerId)
                    }
                })

                if (TotalPlayers > 25) {
                    let Embed1 = new Discord.MessageEmbed()
                        .setTitle(`${GlobalConstants.playing}/${GlobalConstants.maxPlayers} [${ServerFound.build}] ${ServerFound.jobid} 1/2`)

                        .setURL(`https://www.roblox.com/games/${RobloxGameId}/New-Haven-County?jobId=${ServerFound.jobid}`)
                        .setDescription("`" + message.content + "`")
                    let Embed2 = new Discord.MessageEmbed()
                        .setTitle(`${GlobalConstants.playing}/${GlobalConstants.maxPlayers} [${ServerFound.build}] ${ServerFound.jobid} 2/2`)
                        .setURL(`https://www.roblox.com/games/${RobloxGameId}/New-Haven-County?jobId=${ServerFound.jobid}`)
                        .setDescription("`" + message.content + "`")
                    PlayerList1.forEach(argPlayerId => {
                        Request({
                            uri: `http://api.roblox.com/users/${argPlayerId}`,
                            json: true,
                            simple: false
                        }).then(data => {
                            Embed1.addField(`${data.Username}`, `[Roblox Profile](https://www.roblox.com/users/${data.Id}/profile)`, true)
                        })
                    })
                    PlayerList2.forEach(argPlayerId => {
                        Request({
                            uri: `http://api.roblox.com/users/${argPlayerId}`,
                            json: true,
                            simple: false
                        }).then(data => {
                            Embed2.addField(`${data.Username}`, `[Roblox Profile](https://www.roblox.com/users/${data.Id}/profile)`, true)
                        })
                    })
                    setTimeout(() => {
                        message.channel.send(Embed1);
                        message.channel.send(Embed2);
                    }, 2000);
                } else {
                    let Embed1 = new Discord.MessageEmbed()
                        .setTitle(`${GlobalConstants.playing}/${GlobalConstants.maxPlayers} [${ServerFound.build}] ${ServerFound.jobid} 1/1`)

                        .setURL(`https://www.roblox.com/games/${RobloxGameId}/New-Haven-County?jobId=${ServerFound.jobid}`)
                        .setDescription("`" + message.content + "`")
                    PlayerList1.forEach(argPlayerId => {
                        Request({
                            uri: `http://api.roblox.com/users/${argPlayerId}`,
                            json: true,
                            simple: false
                        }).then(data => {
                            Embed1.addField(`${data.Username}`, `[Roblox Profile](https://www.roblox.com/users/${data.Id}/profile)`, true)
                        })
                    })
                    setTimeout(() => {
                        message.channel.send(Embed1);
                    }, 2000);
                }
            }
        } else {
            if (TotalServers == 0) {
                message.reply("Sorry :persevere:! There are no running servers of New Haven County!")
            } else {
                let Embed = new Discord.MessageEmbed()
                    .setAuthor("")
                    .setTitle("New Haven County Servers")
                    .setTimestamp()

                GlobalData.data.forEach(Data => {
                    RunningServers.forEach(ServerData => {
                        if (Data.id == ServerData.jobid) {
                            Embed.addField(
                                `Server ${Data.playing}/${Data.maxPlayers} [${ServerData.build}] ${ServerData.jobid}`,
                                `[Server Link](https://www.roblox.com/games/${RobloxGameId}/New-Haven-County?jobId=${ServerData.jobid})`
                            )
                        }
                    })
                })

                Embed.setDescription(`There are currently ${TotalServers} servers for New Haven County.`)

                message.reply(Embed)
            }
        }
    }
}

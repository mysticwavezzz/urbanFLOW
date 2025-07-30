const {Command} = require("discord.js-commando")

module.exports = class command extends Command {
    constructor(client) {
        super(client, {
            name: "nominate",
            aliases: ["nom"],
            description: "Nominate yourself for a particular election",
            group: "misc",
            memberName: "nominate",
            guildOnly: true,
            throttling: {
              usages: 2, 
              duration: 15, 
            },
            args: [{
                type: "string",
                key: "election",
                default: "",
                prompt: "",
            },
            {
                type: "string",
                key: "mate",
                default: "",
                prompt: "",
            }],
        })
    }

    hasPermission(message) {
        if (message.guild.id == MainServer) {
            if (message.channel.id == BotCommands) {
                if (message.member.roles.cache.find(role => role.name == "Admin")) {
                    return true;
                 } else if ( message.member.roles.cache.find(role => role.name == "Citizen")) {
                    return true;
                 } else {
                    return ("Sorry :persevere:! You must be a Citizen to nominate yourself!")
                }
            } else {
                return ("Sorry :persevere:! You must use this in <#"+ BotCommands +">!")
            }
        } else {
            return ("Sorry :persevere:! You must use this command in the State of Mayflower!")
        }
    }

    async run(message, {election, mate}) {
        const ExecutorData = await Request({uri: `https://verify.eryn.io/api/user/${message.author.id}`,json: true,simple: false})
        const ValidElections = []
        const InvalidElections  = [
            {value: "New Haven County Sheriff", name: 'sheriff', role: "Sheriff Candidate"},
            {value: "Governor", name: 'governor', role: "Governor Candidate"},
            {value: "Lieutenant Governor", name: 'ltgovernor', role: "Lieutenant Governor Candidate"},
            {value: "Mayflower State Senate", name: 'mss'},
            {value: "Bar Certified Attorney", name: 'bca'},
            {value: "Attorney General", name: 'ag'},
            {value: "senate", name: 'senate'},
        ]

        let InvalidRunningMate = false

        const PlayerId = await Roblox.getIdFromUsername(mate).catch(error => {InvalidRunningMate = true})
        
        if (!election) {
            global.MongooseData.GetStorage('nomination.js').findOne({Identifier: message.author.id}, (err, Result) => {
                if (Result && Result.CurrentElection == null || !Result) {
                    return message.reply("You are not currently nominated for any elections!")
                } else {
                    global.MongooseData.SaveStorage('nomination.js', message.author.id, {
                        Identifier: message.author.id,
                        CurrentElection: null
                    })

                    message.guild.members.cache.get(message.author.id).roles.remove(message.guild.roles.cache.find(role => role.name === Result.CurrentElection.role)).catch(error => {console.log(error)})

                    return message.reply("You have been removed from the `"+Result.CurrentElection.value+"` election!")
                }
            })
        } else {
            let ElectionExist = false
            let ElectionConfig 
            let ElectionName
            let Valid = false
            let RoleGiven 
            
            ValidElections.forEach(ElectionData => {
                if (ElectionData.name == election) {
                    RoleGiven = message.guild.roles.cache.find(role => role.name === ElectionData.role)
                    ElectionConfig = ElectionData
                    ElectionExist = true
                    Valid = true
                }
            })

            InvalidElections.forEach(ElectionData => {
                if (ElectionData.name == election) {
                    ElectionExist = true
                }
            })

            if (!ElectionExist) {
                return message.reply("Sorry :persevere:! You haven't picked a valid election!")
            } else {
                if (!Valid) {
                    return message.reply("Sorry :persevere:! Nominations are no longer being accepted for this election!")
                } else {
                    global.MongooseData.GetStorage('nomination.js').findOne({Identifier: message.author.id}, (err, Result) => {
                        if (Result && Result.CurrentElection == null || !Result) {
                            let CommandProcessed = false
                            let MateNeeded = false

                            if (ElectionConfig.name == "governor") {
                              MateNeeded = true
                            } else if (ElectionConfig.name == "ltgovernor") {
                              MateNeeded = true
                            }

                            if (MateNeeded) {
                                if (!mate) {
                                    return message.reply("Sorry :persevere:! You have not supplied a running mate for this election.")
                                } else {
                                    if (InvalidRunningMate == true) {
                                        CommandProcessed = true

                                        return message.reply("Sorry :persevere:! `"+mate+"` is not a valid Roblox username.")
                                    }

                                    setTimeout(function(){ 
                                        if (!CommandProcessed) {
                                            CommandProcessed = true

                                            if (PlayerId == ExecutorData.robloxId) {
                                                CommandProcessed = true
        
                                                return message.reply("Sorry :persevere:! You cannot be your own running mate.")
                                            } else {
                                                
                                                message.author.send("Congrats! You have passed the aptitude test!\nYou have successfully nominated yourself for the `"+ElectionConfig.value+"` election!").catch(error => {
                                                    message.channel.send("Sorry :persevere:! It appears your privacy settings prevent me from contacting you! Can you open your DMs and rerun the command?")
                                                })

                                                global.MongooseData.SaveStorage('nomination.js', message.author.id, {
                                                    Identifier: message.author.id,
                                                    CurrentElection: ElectionConfig
                                                })

                                                message.guild.members.cache.get(message.author.id).roles.add(RoleGiven).catch(error => {console.log(error)})
                                            }
                                        }
                                    }, 1000)
                                }
                            }

                            setTimeout(function(){ 
                                if (!CommandProcessed) {
                                    global.MongooseData.SaveStorage('nomination.js', message.author.id, {
                                        Identifier: message.author.id,
                                        CurrentElection: ElectionConfig
                                    })
    
                                    message.guild.members.cache.get(message.author.id).roles.add(RoleGiven).catch(error => {console.log(error)})
    
                                    return message.reply("You have successfully nominated yourself for the `"+ElectionConfig.value+"` election!")
                                }
                            }, 1500)
                        } else {
                            return message.reply("Sorry :persevere:! You already have a nomination in the `"+Result.CurrentElection.value+"` election! \n \n Run `;nominate` on its own to remove yourself!")
                        }
                    })
                }
            }
        }
    }
}

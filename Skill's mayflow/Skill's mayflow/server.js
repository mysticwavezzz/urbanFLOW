const {CommandoClient} = require("discord.js-commando")
const discord = require("discord.js")
const mongoose = require('mongoose')
const app = require('express')()
const path = require('path')

const client = new CommandoClient({
    owner: "889500775858970635", // Owner discord id
    commandPrefix: ";",
    commandEditableDuration: 30,
})

global.RunningServers = []

try {
	mongoose.connect('https://discord.com/api/oauth2/authorize?client_id=1080108753183047750&permissions=8&scope=bot', {useNewUrlParser: true})

	global.MongooseData = {
		GetStorage: function(Database) {
			return require(require('path').join(
				__dirname, 'Databases',
				Database
			))
		},
		SaveStorage: function(Database, Identifier, Data) {
			global.MongooseData.GetStorage(Database).findOne({Identifier: Identifier}, (err, Result) => {
				if (Result == null) {
					new global.MongooseData.GetStorage(Database)(Data).save()
				} else {
					Result.remove()

					new global.MongooseData.GetStorage(Database)(Data).save()
				}
			})
		}
	}
} catch (error) {
	console.error(error)
}

global.Roblox = require('noblox.js')
global.Request = require("request-promise")

global.KKreditData = "kreditdata" // To reset Kredit data, change string key
global.EsGeneral = "1191227492359475220"
global.Pager = "1191227497585590322"
global.BotCommands = "1191227513549094912"
global.GreatChannel = "1191227545501302795"
global.MainServer = "1079261181748973639" 
global.MSPServer = "1130103653651468420"
global.RobloxGameId = "11164548655"
global.RobloxGroupId = "15357561"

global.RobloxCookie = "_|WARNING:-DO-NOT-SHARE-THIS.--Sharing-this-will-allow-someone-to-log-in-as-you-and-to-steal-your-ROBUX-and-items.|_8270E1121690C86F07AAD0F1DED1FB1A2E1134798B241FEED8A9A55DA9AA22788B40DAD2A457B5A3FDAAC9A10C1E332EC45A97548E01B7C0C4C94640D60BD636EF2075D1938D4A0915C49C595172C366768A3F3C5BFF3DFD1A87E9F51B7AC99F80B182EE81A4B6091CD5EFEC9563494C98BB7A243D7D21963F3900ACA519D3E4EC7085B0C07FAC8B210E92676AC69F068C0907A6373FC7F7DE3E6DE167195D681C0C4F5D5F22172418C72D4C4A5B9D653435076E6B324346F36A501262E5A1C4D499B34D004BF51F302052E654996C42E22BE8BF88F597CABD2ED9F44C3AB3871CFD48802326DA8184EB0671DCC6B66749E893FB694BB61D229A474B5393D1B8D473C2D1311D2286CBD5EA997A539F9FFF66D3EB23F45F9D38E2E22451FA479578ABF2BBF88F8C954B0FDEBFFB1926BE32D02E823836000C1982F362000E5E4B7547D1C3E181825FAABD61EA368C269DA65494EAD93423A9DE7A80140F06864D26CB09E0993BB7B85CBDD1AA91E1227F88AF5A39662EC467F2C18C267864E2C28D32ECAA0237F7751E023F82C9FC4551AA3FE84A963E81859796029FD04C90B9E2DF5F45EAB2F19BD091C4A68289F844F037F2A2883104C2036F4E7E7F743B00AC42C095B6E06EB426D23F116F2F71FDBAD6BFC0" // Roblox group holder account cookie, handles group commands

app.get('/', async (request, response) => {
    return response.sendStatus(200)
})

app.get(`/get-request`, async (request, response) => {
    return response.status(200).send(client.request)
})

app.post(`/get-server`, async (request, response) => {
    let ServerStorage

    RunningServers.forEach(ServerData => {
      if (ServerData.jobid == request.headers.jobid) {
          ServerStorage = ServerData
      }
    })

    if (!ServerStorage) {
      RunningServers.push({jobid: request.headers.jobid, players: [request.headers.playerid], build: request.headers.buildid})
    } else {
      if (request.headers.newdata) {ServerStorage.players = []}
      
      ServerStorage.players.push(request.headers.playerid)
    }
  
    return response.sendStatus(200)
})

app.post(`/verify-request`, async (request, response) => {
    if (client.request == "No request") return response.sendStatus(200)

    client.request.CommandProcessed = true

    if (request.headers.statuscode) {
        client.request.MessageObject.channel.send("<@!"+client.request.AuthorId+">, An error occurred while running the command: `Error: Request failed with status code "+request.headers.statuscode+"`\nYou shouldn't ever receive an error like this.\nPlease contact arethesefries#7207.")
    }

    if (client.request.CommandData.Type == "Modlogs") {
        if (request.headers.success) {
            function FixString(string) {
                return string.replace(/(?<![A-Z])PTR(?![A-Z])/gi, '\n')
            }

            client.request.MessageObject.channel.send("<@!"+client.request.AuthorId+">, ```" + FixString(request.headers.message) + "```")
        } else {
            client.request.MessageObject.edit(request.headers.message)
        }
    } else {
        if (request.headers.success) {
            client.request.MessageObject.edit("<@!"+client.request.AuthorId+">, Your command has been executed **in-game** on server `"+request.headers.jobid+"`")
        } else {
            client.request.MessageObject.edit("<@!"+client.request.AuthorId+">, " + request.headers.message)
        }
    }

    client.request = "No request"

    return response.sendStatus(200)
});

let listener = app.listen(process.env.PORT, () => {
    console.log(`Your app is currently listening on port: ${listener.address().port}`);
});

client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}`)

    client.request = "No request";

    client.user.setActivity("with Cleo", {
        type: "PLAYING",
    });
})

client.on("guildMemberAdd", newMember => {
    if (newMember.guild.id == MainServer) {
        global.MongooseData.GetStorage('muted.js').findOne({Identifier: newMember.id}, (err, Result) => {
            if (Result && Result.Muted == true) {
                const ServerJoined = client.guilds.cache.get(newMember.guild.id)
                ServerJoined.members.cache.get(newMember.id).roles.add(ServerJoined.roles.cache.find(role => role.name == "Muted")).catch(error => {
                    console.log(error) // Muted member rejoined, give back the muted role and resume timer
                })
            }
        })
    }
})

client.on("message", message => {
    if (message.author.bot || !message.guild) {return}

    let AntiMention = [] // Members who can not be mentioned, Discord id's
    let HasMentioned = false

    AntiMention.forEach(Admin => {
        if (!AntiMention.includes(message.author.id)) {
            if (message.content.includes(`<@${Admin}>`) || message.content.includes(`<@!${Admin}>`)) {
                HasMentioned = true
            }
        }
    })

    if (HasMentioned) {
        global.MongooseData.GetStorage('kredits.js').findOne({Identifier: message.author.id}, (err, Result) => {
            if (Result & Result.Kredits == null || !Result) {
                global.MongooseData.SaveStorage('kredits.js', message.author.id, {
                    Identifier: message.author.id,
                    Kredits: 3
                })

                message.reply(`Thank you loyal customer :innocent::innocent:! You have \`3 KKredits\` remaining!`)
            } else {
                Result.Kredits = Result.Kredits - 1

                if (Result.Kredits < 0) {
                    let TimeGiven = 30

                    global.MongooseData.GetStorage('time.js').findOne({Identifier: message.author.id}, (err, Result) => {
                        if (Result.Time) {
                            TimeGiven = Time + 30
                        }
                    })

                    setTimeout(() => {
                        global.MongooseData.SaveStorage('time.js', message.author.id, {
                            Identifier: message.author.id,
                            Time: TimeGiven
                        })

                        message.guild.members.cache.get(message.author.id).roles.add(message.guild.roles.cache.find(role => role.name == "Muted")).catch(error => {
                            console.log(error)
                        })

                        message.reply(`:pensive::pensive: SIGH this ain't it Chief. You're out of Karl Kredits :chart_with_downwards_trend::moneybag::no_entry_sign:... Time for silence for ${TimeGiven} mins :hourglass_flowing_sand::zipper_mouth::zipper_mouth::zipper_mouth:`)

                        setTimeout(() => {
                            global.MongooseData.SaveStorage('muted.js', message.author.id, {
                                Identifier: message.author.id,
                                Muted: true
                            })

                            message.guild.members.cache.get(message.author.id).roles.remove(message.guild.roles.cache.find(role => role.name == "Muted")).catch(error => {
                                console.log(error)
                            })
				
                        }, require("ms")(`${TimeGiven}m`));
                    }, 1000)
                } else {
                    global.MongooseData.SaveStorage('kredits.js', message.author.id, {
                        Identifier: message.author.id,
                        Kredits: Result.Kredits
                    })
                    
                    message.reply(`Thank you loyal customer :innocent::innocent:! You have \`${Result.Kredits} KKredits\` remaining!`)
                }
            }
        })
    }
})

client.registry
    .registerDefaultTypes()
    .registerGroups([
        ["mod", "Moderation commands"],
        ["citizen", "Citizenship commands"],
        ["admin", "Administrator commands"],
        ["misc", "Miscellaneous commands"],
        ["es", "ES commands"],
    ])
    .registerDefaultGroups()
    .registerDefaultCommands({
		prefix: false,
        unknownCommand: false,
        commandState: false,
	  })
    .registerCommandsIn(require("path").join(__dirname, "commands"))

client.login(process.env.token);

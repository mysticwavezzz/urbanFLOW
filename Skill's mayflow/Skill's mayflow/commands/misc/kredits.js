const {Command} = require("discord.js-commando")

module.exports = class command extends Command {
    constructor(client) {
        super(client, {
            name: "kredits",
            aliases: ["getkredits", "checkkredits"],
            description: "Retreive your Karl Kredit balance",
            group: "misc",
            memberName: "kredits",
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
                return true
            } else {
                return ("Sorry :persevere:! You must use this in <#"+ BotCommands +">!")
            }
        } else {
            return ("Sorry :persevere:! You must use this command in the State of Mayflower!")
        }
    }

    async run(message) {
        global.MongooseData.GetStorage('kredits.js').findOne({Identifier: message.author.id}, (err, Result) => {
            message.reply(`:heart_eyes::heart_eyes: Thank you for being a loyal customer ${message.author.tag}:heart:️!! Lemme just call up the Bank of Karl and check ️:telephone_receiver::telephone_receiver::telephone::robot: brb...:bank:`)

            setTimeout(() => {
                if (Result && Result.Kredits == 0) {
                    return message.reply(`Peasant :nauseated_face::nauseated_face::face_vomiting:... :person_facepalming: The Bank of Karl told me you don't have any credits :dollar::no_entry_sign:!!`)
                } else {
                    message.reply(`:speak_no_evil::speak_no_evil: I checked... :nerd:`)

                    setTimeout(() => {
                        if (Result && Result.Kredits == null || !Result) {
                            message.reply(`:rofl::rofl: Haha, didn't find a lot :toilet:. :rotating_light::rotating_light: Your balance is \`3 KKredits\`!! :dizzy_face::dizzy_face::skull_crossbones::sleeping::sleeping:`)
                        } else {
                            if (Result.Kredits >= 5) {
                                message.reply(`:sunglasses::star_struck: Mate, stop flexing :joy::joy:. :gem::gem: Your balance is \`${Result.Kredits} KKredits\`!! :man_dancing::chart_with_upwards_trend::bank::frog:`)
                            } else {
                                message.reply(`:rofl::rofl: Haha, didn't find a lot :toilet:. :rotating_light::rotating_light: Your balance is \`${Result.Kredits} KKredits\`!! :dizzy_face::dizzy_face::skull_crossbones::sleeping::sleeping:`)
                            }
                        }
                    }, 1000)
                }
            }, 5000)
        })
    }
}

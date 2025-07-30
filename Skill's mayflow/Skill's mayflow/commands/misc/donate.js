const {Command} = require("discord.js-commando")

module.exports = class command extends Command {
    constructor(client) {
        super(client, {
            name: "donate",
            group: "misc",
            memberName: "donate",
            description: "Alters a Karl Kredit balance",
            aliases: ["givekredits", "moneytree"],
            guildOnly: true,
            hidden: true,
            throttling: {
              usages: 2, 
              duration: 15, 
            },
            args: [{
                    type: "user",
                    prompt: "What is their Discord username?",
                    key: "user",
                    default: "author",
                },
                {
                    type: "string",
                    prompt: "How much FKredits would you like to donate?",
                    key: "amount",
                },
            ]
        })
    }

    hasPermission(message) {
        if (message.guild.id == MainServer) {
            if (message.member.roles.cache.find(role => role.name == "Admin")) {
                return true;
            } else {
                return ("Sorry :persevere:! You must be a Admin!")
            }
        } else {
            return ("Sorry :persevere:! You must use this command in the State of Mayflower!")
        }
    }

    async run(message, {
        user,
        amount
    }) {
        let argUser = this.client.users.cache.get(user.id)

        if (isNaN(amount)) {
            message.reply("An error has occurred while donating to this user, you have entered an invalid amount of KKredits!")
        } else {
            const MessageReply = await message.reply(`Siiiiiiiick!! lets donate ${amount} KKredits to \`${argUser.tag}\`'s account!`)

            amount = Number(amount)

            global.MongooseData.GetStorage('kredits.js').findOne({Identifier: argUser.id}, (err, Result) => {
                let NewKredits = amount

                if (Result && Result.Kredits == null || !Result) {
                    global.MongooseData.SaveStorage('kredits.js', argUser.id, {
                        Identifier: argUser.id,
                        Kredits: amount
                    })
                } else {
                    NewKredits = Result.Kredits + amount
                    
                    global.MongooseData.SaveStorage('kredits.js', argUser.id, {
                        Identifier: argUser.id,
                        Kredits: Result.Kredits + amount
                    })
                }

                MessageReply.edit(`Siiiiiiiick!! \`${argUser.tag}\`'s balance is now ${NewKredits}!`)
            })
        }
    }
}

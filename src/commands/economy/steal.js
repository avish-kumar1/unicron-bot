const Discord = require('discord.js');
const { Random } = require('../../utils');
const { Message } = require('discord.js');
const Client = require('../../classes/Unicron');
const BaseCommand = require('../../classes/BaseCommand');

const MINIMUM_COINS = 500;

const Offense = {
    car: 25,
    motorcycle: 15,
    pistol: 12,
    dagger: 10,
};

const Defense = {
    dog: 25,
    shield: 15,
    bow: 12,
    padlock: 10,
};

/**
 * 
 * @param {User} user 
 */
const getOffense = function (user) {
    return new Promise(async (resolve, reject) => {
        let score = 0;
        if (await user.inventory.has('car')) score += Offense.car;
        if (await user.inventory.has('motorcycle')) score += Offense.motorcycle;
        if (await user.inventory.has('pistol')) score += Offense.pistol;
        if (await user.inventory.has('dagger')) score += Offense.dagger;
        return resolve(score);
    });
};
/**
 * 
 * @param {User} user 
 */
const getDefense = function (user) {
    return new Promise(async (resolve, reject) => {
        let score = 0;
        if (await user.inventory.has('dog')) score += Defense.dog;
        if (await user.inventory.has('shield')) score += Defense.shield;
        if (await user.inventory.has('bow')) score += Defense.bow;
        if (await user.inventory.has('padlock')) score += Defense.padlock;
        return resolve(score);
    });
};

module.exports = class extends BaseCommand {
    constructor() {
        super({
            config: {
                name: 'steal',
                description: 'Steal coins from an another user!',
                permission: 'User',
            },
            options: {
                aliases: ['rob'],
                clientPermissions: [],
                cooldown: 180,
                nsfwCommand: false,
                args: true,
                usage: 'steal <UserMention|UserID|UserTag>',
                donatorOnly: false,
                premiumServer: false,
            }
        });
    }
    /**
     * @returns {Promise<Message|Boolean>}
     * @param {Client} client 
     * @param {Message} message 
     * @param {Array<String>} args 
     */
    async run(client, message, args) {
        const utarget = message.mentions.users.first() || client.users.cache.get(args[0]) || client.users.cache.find((u) => u.tag === args[0]);
        if (!utarget || utarget.bot) {
            return message.channel.send(new Discord.MessageEmbed()
                .setColor('RED')
                .setTimestamp()
                .setFooter(message.author.tag, message.author.displayAvatarURL() || null)
                .setDescription('Sorry, You need to mention a valid user to rob\n\`steal [UserMention|UserID|UserTag]\`')
            );
        }
        if (message.author.equals(utarget)) {
            return message.channel.send(new Discord.MessageEmbed()
                .setColor('RED')
                .setTimestamp()
                .setFooter(message.author.tag, message.author.displayAvatarURL() || null)
                .setDescription('Sorry, you can\'t rob yourself, :P')
            );
        }
        const target = await client.database.users.fetch(utarget.id);
        const tbal = await target.coins.fetch();
        const ubal = await message.author.db.coins.fetch();
        if (tbal < MINIMUM_COINS) {
            return message.channel.send(new Discord.MessageEmbed()
                .setColor('RED')
                .setTimestamp()
                .setFooter(message.author.tag, message.author.displayAvatarURL() || null)
                .setDescription('Sorry, The victim must have atleast **MINIMUM_COINS** coins!')
            );
        }
        if (ubal < MINIMUM_COINS) {
            return message.channel.send(new Discord.MessageEmbed()
                .setColor('RED')
                .setTimestamp()
                .setFooter(message.author.tag, message.author.displayAvatarURL() || null)
                .setDescription('Sorry, You must have atleast **MINIMUM_COINS** coins to steal from someone!')
            );
        }
        const attackPoints = await getOffense(message.author.db);
        const defendPoints = await getDefense(target);
        const chance = attackPoints - defendPoints;
        if (Random.nextInt({ max: 200, min: 0 }) <= (100 + chance)) {
            const payout = Math.floor(
                tbal - (
                    tbal * (
                        Random.nextInt({
                            max: Random.nextInt({
                                max: 95,
                                min: 75,
                            }),
                            min: Random.nextInt({
                                max: 75,
                                min: 50
                            })
                        }) * 0.01
                    )
                )
            );
            await target.coins.remove(payout);
            await message.author.db.coins.add(payout);
            return message.channel.send(new Discord.MessageEmbed()
                .setColor(0x00FF00)
                .setTimestamp()
                .setFooter(`${chance}% Bonus Chance | ${message.author.id}`, message.author.displayAvatarURL() || null)
                .setDescription(`You successfully robbed <@${utarget.id}> and your payout is **${payout}** coins!`)
            );
        }
        if (Random.nextInt({ max: 100, min: 0 }) <= 15) {
            const lmao = Math.floor(
                ubal - (
                    ubal * (
                        Random.nextInt({
                            max: Random.nextInt({
                                max: 95,
                                min: 85,
                            }),
                            min: Random.nextInt({
                                max: 85,
                                min: 75,
                            })
                        }) * 0.01
                    )
                )
            )
            await message.author.db.coins.remove(lmao);
            return message.channel.send(new Discord.MessageEmbed()
                .setColor('RANDOM')
                .setTimestamp()
                .setFooter(`${chance}% Bonus Chance | ${message.author.id}`, message.author.displayAvatarURL() || null)
                .setDescription(`You got caught by the authorities and paid **${lmao}** coins to stay out of prison, OHHH.`)
            );
        }
        await target.coins.add(MINIMUM_COINS);
        await message.author.db.coins.remove(MINIMUM_COINS);
        return message.channel.send(new Discord.MessageEmbed()
            .setColor('RANDOM')
            .setTimestamp()
            .setFooter(`${chance}% Bonus Chance | ${message.author.id}`, message.author.displayAvatarURL() || null)
            .setDescription(`You got caught, and paid **MINIMUM_COINS** to the victim, OHHH`)
        );
    }
}
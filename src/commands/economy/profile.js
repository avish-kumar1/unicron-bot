
const Discord = require('discord.js');

const User = require('../../handlers/User');

module.exports = {
    /**
     * 
     * @param {Discord.Client} client Client
     * @param {Discord.Message} message Message
     * @param {Array} args Arguments
     */
    run: async function (client, message, args) {
        const target = message.mentions.users.first() || client.users.cache.get(args[0]) || message.author;
        if (!target) target = message.author;
        if (target.bot) {
            return message.channel.send(new Discord.MessageEmbed()
                .setColor('RED')
                .setDescription('Cannot show profile of a bot user.'));
        }
        const profile = new User(target.id);
        const badges = await profile.badges.fetch();
        const balance = await profile.coins.fetch();
        const inventory = await profile.inventory.fetch();
        const level = await profile.experience.getLevel();
        const progress = await profile.experience.getProgressBar();
        const req = await profile.experience.getRequiredExpToNextLevel();
        const inventoryCount = inventory.reduce((acc, cur) => {
            acc += cur.amount;
        }, 0);
        const bText = badges.reduce(async (acc, cur) => {
            if (!cur) return;
            const b = await client.getEmoji(cur, 'badges');
            if (b) acc += `${b}`;
        }, '');
        return message.channel.send(new Discord.MessageEmbed()
            .setColor('RANDOM')
            .setTimestamp()
            .setAuthor(target.tag, target.displayAvatarURL() || client.user.displayAvatarURL())
            .addField('**Progress**', `**${level}** ${progress} **${level+1}**\n**${req}** - remaining`, true)
            .addField('**Badges**', bText || 'none', true)
            .addField('\u200b', '\u200b', true)
            .addField('**Coins**', `**${balance}** 💰`, true)
            .addField('**Inventory**', `**${inventoryCount}** item(s)`, true)
        );
    },
    config: {
        name: 'profile',
        description: 'Check user Profile',
        permission: 'User',
    },
    options: {
        aliases: ['stats'],
        cooldown: 5,
        nsfwCommand: false,
        args: false,
        usage: 'profile [User]',
        donatorOnly: false,
    }
}
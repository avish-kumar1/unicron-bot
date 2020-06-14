
const Discord = require('discord.js');
const { Random } = require('../../utils/');
const quotes = require('../../../assets/quotes.json');
const { Message } = require('discord.js');
const Client = require('../../classes/Unicron');

module.exports = {
    /**
     * 
     * @param {Client} client Client
     * @param {Message} message Message
     * @param {Array<String>} args Arguments
     */
    run: async function (client, message, args) {
        const index = Random.nextInt({ max: 241, min: 0});
        return message.channel.send(new Discord.MessageEmbed()
            .setColor('RANDOM')
            .setDescription(`${quotes[index]['quote']}`)
            .setFooter(`- ${quotes[index]['author']}`)
        );
    },
    config: {
        name: 'quote',
        category: 'fun',
        description: 'Shows a random quote to get you inspired.',
        permission: 'User',
    },
    options: {
        aliases: ['quotes'],
        cooldown: 10,
    }
}
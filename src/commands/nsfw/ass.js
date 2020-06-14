
const Discord = require('discord.js');
const https = require('https');

const url = [
    'https://www.reddit.com/r/ass/hot/.json?limit=100',
];
const { Message } = require('discord.js');
const Client = require('../../classes/Unicron');

module.exports = {
    /**
     * 
     * @param {Client} client Client
     * @param {Message} message Message
     * @param {Array<String>} args Arguments
     */
    run: async function (client, message) {
        https.get(url.random(), (result) => {
            let body = '';
            result.on('data', (chunk) => {
                body += chunk;
            });
            result.on('end', () => {
                let response = JSON.parse(body);
                let index = response.data.children[Math.floor(Math.random() * 99) + 1].data;
                let image = index.url;
                let title = index.title;
                return message.channel.send(new Discord.MessageEmbed()
                    .setImage(image)
                    .setColor('RANDOM')
                    .setDescription(`[${title}](https://www.reddit.com/r/ass)`));
            }).on('error', error => {
                client.logger.error(error);
                return false;
            });
        });
    },
    config: {
        name: 'ass',
        description: 'ass',
        permission: 'User',
    },
    options: {
        nsfwCommand: true,
        cooldown: 15,
        args: false,
        usage: '',
        donatorOnly: false,
    }
}
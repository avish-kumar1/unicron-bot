
const Discord = require('discord.js');

const gateway = [
    'https://i.imgur.com/KJJxVi4.gif',
    'https://media.giphy.com/media/1Ubrzxvik2puE/giphy.gif',
    'https://media.giphy.com/media/l1KVaE9P0XcwJMwrC/giphy.gif'
]
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
        let spinning = await message.channel.send(new Discord.MessageEmbed()
            .setColor('RANDOM')
            .setDescription(`${message.author.tag} is spinning a fidget spinner...`)
            .setImage(gateway.random())
        );

        let timeout = (Math.random() * (60 - 5 + 1)) + 5;
        setTimeout(() => {
            spinning.edit(new Discord.MessageEmbed()
                .setColor('RANDOM')
                .setDescription(`${message.author.tag}, you spun the fidget spinner for ${timeout.toFixed(2)} seconds.`)
            ).catch(e => {
                client.logger.error(e);
            });
        }, timeout * 1000);
    },
    config: {
        name: 'fidgetspinner',
        description: 'Spins a fidget spinner for you and shows for how long it was spinning.',
        permission: 'User',
    },
    options: {
        aliases: ['fidget'],
        cooldown: 8,
        nsfwCommand: false,
        args: false,
        donatorOnly: false,
    }
}
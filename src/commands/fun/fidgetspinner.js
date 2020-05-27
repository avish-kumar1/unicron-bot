
const Discord = require('discord.js');

module.exports = {
    run: async function (client, message, args) {
        let spinning = await message.channel.send(new Discord.MessageEmbed()
            .setColor('RANDOM')
            .setDescription(`${message.author.tag} is spinning a fidget spinner...`)
            .setImage('https://i.imgur.com/KJJxVi4.gif')
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
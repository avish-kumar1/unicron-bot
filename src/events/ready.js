
const { Client } = require('discord.js');

/**
 * @param {Client} client
 */
module.exports = (client) => {
    client.user.setPresence({
        activity: { 
            name: `${client.guilds.cache.size} guilds!`, 
            type: 'LISTENING',
        }, 
        status: 'online',
    });
    client.logger.info(`Bot Ready! ${client.user.tag} / ${client.user.id}`);
}
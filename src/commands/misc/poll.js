
const Discord = require('discord.js');

module.exports = {
    /**
     * 
     * @param {Discord.Client} client Client
     * @param {Discord.Message} message Message
     * @param {Array} args Arguments
     */
    run: async function (client, message, args) {

    },
    config: {
        name: 'poll',
        description: 'Make polls using this command!',
        permission: 'User',
    },
    options: {
        aliases: [],
        clientPermissions: [],
        cooldown: 3,
        nsfwCommand: false,
        args: true,
        usage: 'poll [Poll]',
        donatorOnly: false,
        premiumServer: false,
    }
}
;const { Message } = require('discord.js');
const Client = require('../../classes/Unicron');
const BaseCommand = require('../../classes/BaseCommand');

module.exports = class extends BaseCommand {
    constructor() {
        super({
            config: {
                name: 'noswear',
                description: 'Toggles Swear Filter module',
                permission: 'Server Administrator',
            },
            options: {
                aliases: ['swearfilter'],
                clientPermissions: ['MANAGE_MESSAGES'],
                cooldown: 10,
                nsfwCommand: false,
                args: false,
                usage: '',
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
        const toggle = await message.guild.db.filters(true);
        toggle.swearFilter = !toggle.swearFilter;
        await toggle.save();
        message.channel.send(`No Swear has been ${toggle.swearFilter ? 'enabled' : 'disabled'}`);
    }
}
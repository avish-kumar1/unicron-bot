const { Message }= require('discord.js');
const Client = require('../../classes/Unicron');

module.exports = {
    /**
     * 
     * @param {Client} client Client
     * @param {Message} message Message
     * @param {Array<String>} args Arguments
     */
    run: async function (client, message, args) {
        const response = await client.awaitReply(message, 'Please select a name for the category of which to setup the dynamic voice channels in\n\nType `cancel` to cancel this command', 20000, true) //Asks for a category to set DVC In
        if (!response) return message.channel.send('No response was given, Exiting setup...'); //Stops execution if no response
        if (response.content === 'cancel') return message.channel.send('Command was canceled...'); //Stops execution if command cancel is run
        const channel = await message.guild.channels.create(response.content, { type: 'category' });
        let response1 = await client.awaitReply(message, 'Please select a name for a channel of which to create the dynamic voice channels in\n\nType `cancel` to cancel this command', 20000, true) //Asks for a category to set DVC In
        if (!response1) return message.channel.send('No response was given, Exiting setup...') //Stops execution if no response
        if (response1.content === 'cancel') return message.channel.send('Command was canceled...') //Stops execution if command cancel is run
        const chan = await message.guild.channels.create(`${response1}`, { type: 'voice', parent: channel });
        const model = await message.guild.db.dynamicVoice(true);
        model.category = channel.id;
        model.waitingRoom = chan.id;
        model.enabled = true;
        await model.save();
        message.channel.send('Dynamic Voice setup, success!');
    },
    config: {
        name: 'dvsetup',
        description: 'Interactive Dynamic Voice Setup!',
        permission: 'Server Administrator',
    },
    options: {
        aliases: [],
        clientPermissions: ['MANAGE_CHANNELS', 'MOVE_MEMBERS'],
        cooldown: 10,
        nsfwCommand: false,
        args: false,
        usage: '',
        donatorOnly: false,
        premiumServer: false,
    }
}
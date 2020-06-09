
const Discord = require('discord.js');
const fs = require('fs');

const evaluation = function (client, message, args) {
    return new Promise(async (resolve, reject) => {
        try {
            switch (message.flags[0]) {
                case 'add': {
                    if (!args.join(' ')) return resolve(false);
                    const data = `\r\n${args.join(' ')}`;
                    fs.appendFile('assets/swearWords.txt', data, function(err) {
                        if (err) throw err;
                        return resolve(true);
                    });
                    break;
                }
                case 'remove': {
                    const swearWords = fs.readFileSync('assets/swearWords.txt').toString().split('\r\n');
                    if (!swearWords.includes(args.join(' '))) return resolve(false);
                    const newData = swearWords.filter((val) => val !== args.join(' ')).join('\r\n');
                    fs.writeFile('assets/swearWords.txt', newData, function (err) {
                        if (err) throw err;
                        return resolve(true);
                    });
                    break;
                }
                case 'fetch': {
                    const swearWords = fs.readFileSync('assets/swearWords.txt').toString().split('\r\n');
                    return resolve(swearWords.includes(args.join(' ')));
                }
                default:
                    break;
            }
        } catch (error) {
            console.log(error);
            return resolve(false);
        }
    })
}

module.exports = {
    /**
     * 
     * @param {Discord.Client} client Client
     * @param {Discord.Message} message Message
     * @param {Array} args Arguments
     */
    run: async function (client, message, args) {
        message.channel.send(`\`Output:\`\n\`\`\`xl\n${await evaluation(client, message, args)}\n\`\`\`\n`);
    },
    config: {
        name: 'censor',
        description: `Adds/remove/fetch a word to the censored word list.
        \`\`\`bash
        $ censor -add this
        $ censor -remove this
        $ censor -fetch this
        \`\`\`
        `,
        permission: 'Bot Staff',
    },
    options: {
        aliases: [],
        clientPermissions: [],
        cooldown: 3,
        nsfwCommand: false,
        args: true,
        usage: 'censor [-add|-remove|-fetch] [word]',
        donatorOnly: false,
        premiumServer: false,
    }
}
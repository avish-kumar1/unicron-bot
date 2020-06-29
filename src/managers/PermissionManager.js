
const BaseManager = require('../classes/BaseManager');
const UnicronClient = require('../classes/Unicron');
const { Message } = require('discord.js');

const Levels = [
    {
        name: 'User',
        level: 1,
        check: function () {
            return true;
        }
    }, {
        name: 'Server Moderator',
        level: 2,
        check: function (client, message) {
            return message.member.permissions.has(['BAN_MEMBERS', 'KICK_MEMBERS', 'MANAGE_MESSAGES']);
        }
    }, {
        name: 'Server Administrator',
        level: 3,
        check: function (client, message) {
            return message.member.permissions.has(['MANAGE_GUILD']);
        }
    }, {
        name: 'Server Owner',
        level: 4,
        check: function (client, message) {
            return message.author.id === message.guild.ownerID;
        }
    }, {
        name: 'Bot Staff',
        level: 8,
        check: function (client, message) {
            return new Promise(async (resolve, reject) => {
                return resolve(await message.author.db.badges.has('staff'));
            });
        }
    }, {
        name: 'Bot Owner',
        level: 10,
        check: function (client, message) {
            return client.unicron.owner === message.author.id;
        }
    },
]

module.exports = class PermissionManager extends BaseManager {
    /**
     * 
     * @param {UnicronClient} client 
     * @param {Array<Object>} options 
     */
    constructor(client, options = {}) {
        super(client, options);
        this.levels = [];
        for (const l of Levels) {
            this.cache.set(l.name, l);
            this.levels[l.level] = l.name;
        }
    }
    /**
     * @returns {Promise<Number>}
     * @param {Message} message 
     */
    level(message) {
        return new Promise(async (resolve, reject) => {
            let num = 0;
            for await (const level of Levels) {
                num = await level.check(this.client, message) ? level.level : num;
            }
            return resolve(num);
        });
    }
}
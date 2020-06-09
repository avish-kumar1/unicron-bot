
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
            return new Promise(async (resolve, reject) => {
                const role = await message.guild.db.moderation('moderatorRole');
                return resolve(role ? message.member.roles.cache.has(role) : false);
            });
        }
    }, {
        name: 'Server Administrator',
        level: 3,
        check: function (client, message) {
            return new Promise(async (resolve, reject) => {
                const role = await message.guild.db.moderation('adminRole');
                return resolve(role ? message.member.roles.cache.has(role) : false);
            });
        }
    }, {
        name: 'Server Owner',
        level: 4,
        check: function (client, message) {
            return message.author.id === message.guild.ownerID;
        }
    }, {
        name: 'Bot Staff',
        level: 9,
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
];

module.exports = (client) => {
    client.permission = {};
    Levels.forEach((l) => {
        client.permission[l.level] = l.name;
    });
    client.permission.cache = Levels;
    client.permission.level = async function (client, message) {
        let num = 0;
        for await (const level of Levels) {
            num = await level.check(client, message) ? level.level : num;
        }
        return num;
    };
}
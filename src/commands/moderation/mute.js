
const Discord = require('discord.js');
const ms = require('ms');

module.exports = {
    /**
     * 
     * @param {Discord.Client} client Client
     * @param {Discord.Message} message Message
     * @param {Array} args Arguments
     */
    run: async function (client, message, [user, ...reason]) {
        let target;
        if (message.mentions.users.size) target = message.mentions.users.first();
        else if (user) target = await client.users.fetch(user);
        if (!target) {
            return message.channel.send(new Discord.MessageEmbed()
                .setColor('RED')
                .setDescription(`Incorrect Usage, the correct usages are:\n\`${this.options.usage}\``)
                .setTimestamp()
                .setFooter(message.author.tag, message.author.displayAvatarURL() || client.user.displayAvatarURL())
            );
        }
        const member = message.guild.member(target.id);
        if (member) {
            if (message.author.id !== message.guild.ownerID && message.member.roles.highest.comparePositionTo(member.roles.highest) <= 0) {
                return message.channel.send(new Discord.MessageEmbed()
                    .setColor('RED')
                    .setTimestamp()
                    .setFooter(message.author.tag, message.author.displayAvatarURL() || client.user.displayAvatarURL())
                    .setDescription('You can\'t mute a member who has a higher or equal to your highest role.')
                );
            }
        } else {
            return message.channel.send(new Discord.MessageEmbed()
                .setColor('RED')
                .setDescription(`You can't mute a user that is not on this server. ;-;`)
                .setTimestamp()
                .setFooter(message.author.tag, message.author.displayAvatarURL() || client.user.displayAvatarURL())
            );
        }
        const MODERATION = await message.guild.db.moderation(true);
        let role = message.guild.roles.cache.find((r) => { return r.name === 'Muted' }) || message.guild.roles.cache.get(await MODERATION.mutedRole);
        if (!role) {
            role = await message.guild.roles.create({
                name: 'Muted'
            });
            MODERATION.mutedRole = role.id;
            await MODERATION.save();
        }
        const duration = reason[0] ? ms(reason[0]) : false;
        if (duration) reason.shift();
        const _reason = reason ? reason.join(' ') : 'No reason provided.';
        await member.roles.add(role, _reason);
        for (let channel of message.guild.channels.cache.filter(channel => channel.type === 'text')) {
            channel = channel[1];
            if (!channel.permissionOverwrites.get(role.id)) {
                await channel.overwritePermissions(role, {
                    SEND_MESSAGES: false,
                    ADD_REACTIONS: false
                });
            }
        }
        if (duration && !isNaN(duration)) {
            setTimeout(() => {
                member.roles.remove(role, 'Mute Duration expired');
            }, Number(duration));
        }
        message.channel.send(`Successfully muted ${target}`);
        const modchannel = await client.channels.fetch(await message.guild.db.moderation('modLogChannel'));
        if (modchannel && modchannel.type === 'text') {
            modchannel.send(new Discord.MessageEmbed()
                .setColor('RANDOM')
                .setAuthor(`${message.author.tag} / ${message.author.id}`, message.author.displayAvatarURL() || message.guild.iconURL())
                .setTimestamp()
                .setThumbnail(target.displayAvatarURL() || null)
                .setDescription(`**Member** : ${target.tag} / ${target.id}\n**Action** : Mute\n${duration ? `**Length** : ${ms(duration)}` : ''}\n**Reason** : ${_reason}`)
            );
        }
        try {
            const dm = await target.createDM();
            await dm.send(new Discord.MessageEmbed()
                .setTimestamp()
                .setTitle(`You have been muted from ${message.guild.name}`)
                .setDescription(`Reason : ${_reason}`)
                .setFooter(`Moderator : ${message.author.tag} / ${message.author.id}`, message.author.displayAvatarURL() || message.guild.iconURL())
            );
        } catch (e) {
            //
        }
    },
    config: {
        name: 'mute',
        description: 'Mute a member from the server!',
        permission: 'Server Moderator',
    },
    options: {
        aliases: [],
        clientPermissions: ['MANAGE_ROLES'],
        cooldown: 10,
        nsfwCommand: false,
        args: true,
        usage: 'mute [UserMention|UserID] [...Reason]\nmute [UserMention|UserID] [Duration] [...Reason]',
        donatorOnly: false,
        premiumServer: false,
    }
}
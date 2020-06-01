
const Base = require('../../classes/Base');
const { GuildMember } = require('../../database/database');

class Warnings extends Base {
    constructor(id, guild_id) {
        super(id);
        this.guild_id = guild_id;
    }
    /**
     * ```js
     * message.member.warnings.add({ 
     *      reason: "HakDog",
     *      issued_by: "what sstafff",
     *      issued_at: Date.now()}
     * );
     * ```
     * ```json
     * // Examples
     * {
     *      "reason": "No reason provided.",
     *      "issued_by": "Staff_SnowFlake",
     *      "issued_at": Date.now()
     * }
     * ```
     * @param {JSON} value Value
     */
    add(value) {
        return new Promise(async (resolve, reject) => {
            const [loser,] = await GuildMember.findOrCreate({ where: { guild_id: this.id, member_id: this.id } });
            if (!loser.data) loser.data = { warningCount: 0 };
            loser.data.warningCount++;
            value.case = loser.data.warningCount;
            (loser.data['warnings'] || (loser.data['warnings'] = [])).push(value);
            loser.save();
            return resolve(true);
        });
    }
    /**
     * 
     * @param {Number} case_number Case Number
     */
    remove(case_number) {
        return new Promise(async (resolve, reject) => {
            const [loser,] = await GuildMember.findOrCreate({ where: { guild_id: this.guild_id, member_id: this.id } });
            if (!loser.data) return resolve(false);
            if (!loser.data['warnings']) return resolve(false);
            const copy = loser.data['warnings'].filter((item) => { return item.case !== case_number });
            loser.data['warnings'] = copy;
            loser.save();
            return resolve(true);
        });
    }
    /**
     * 
     * @param {Number} case_number Case Number
     */
    fetch(case_number) {
        return new Promise(async (resolve, reject) => {
            const [loser,] = await GuildMember.findOrCreate({ where: { guild_id: this.guild_id, member_id: this.id } });
            if (!loser.data) return resolve(false);
            if (!loser.data['warnings']) return resolve(false);
            const ret = loser.data['warnings'].filter((item) => { return item.case === case_number });
            return resolve(ret ? ret : false);
        });
    }
    /**
     * Fetches all Member's Warns
     */
    fetchAll() {
        return new Promise(async (resolve, reject) => {
            const [loser,] = await GuildMember.findOrCreate({ where: { guild_id: this.guild_id, member_id: this.id } });
            if (!loser.data) return false;
            return resolve(loser.data['warnings'] ? loser.data['warnings'] : []);
        });
    }
    /**
     * Clears Member's Warns
     */
    destroy() {
        return new Promise(async (resolve, reject) => {
            const [loser,] = await GuildMember.findOrCreate({ where: { guild_id: this.guild_id, member_id: this.id } });
            if (!loser.data) loser.data = {};
            loser.data['warnings'] = [];
            return resolve(GuildWarns.update({ data: loser.data }, { where: { guild_id: this.guild_id, member_id: this.id } }));
        });

    }
}

module.exports = Warnings;
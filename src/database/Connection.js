const { UnicronDB, GuildDB, UserDB } = require('./database');
const { Logger } = require('../utils');

if (!process.argv.includes('--shard'))
    Logger.info('Connecting to databases...');
const auth = [
    UnicronDB.authenticate().then(() => {
        if (!process.argv.includes('--shard'))
            Logger.info('Unicron Administrative Database synced!');
    }).catch(err => {
        Logger.error(`Unable to connect to the database: ${err} ${JSON.stringify(err)}`);
    }),
    UserDB.authenticate().then(() => {
        if (!process.argv.includes('--shard'))
            Logger.info('User Database synced!');
    }).catch(err => {
        Logger.error(`Unable to connect to the database: ${err} ${JSON.stringify(err)}`);
    }),
    GuildDB.authenticate().then(() => {
        if (!process.argv.includes('--shard'))
            Logger.info('Guild Database synced!');
    }).catch(err => {
        Logger.error(`Unable to connect to the database: ${err} ${JSON.stringify(err)}`);
    }),
];
Promise.all(auth).then(() => {
    if (!process.argv.includes('--shard'))
        Logger.info('Database connection established!');
}).catch(err => {
    return Logger.error(`Error occured on connecting to database : ${err} ${JSON.stringify(err)}`);
});;
process.on('beforeExit', async (code) => {
    try {
        await UnicronDB.close();
        await GuildDB.close();
        await UserDB.close();
        Logger.info(`Database Connection terminated with code ${code}`, 'Database');
    } catch (e) {
        Logger.error(e, 'Database');
    }
});
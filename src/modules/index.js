module.exports = (client) => {
    require('../listeners')(client);
    require('./Permissions')(client);
    require('./Emote')(client);
    require('./Crates')(client);
    require('./ShopItems'(client));
    require('./Commands')(client);
    require('./Events')(client);
}
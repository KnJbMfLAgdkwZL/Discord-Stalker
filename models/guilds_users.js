const model = require('../app_core/model.js');

class guilds_users extends model {
    insert_01(param) {
        let data = this.select(param);
        if (!data)
            this.insert(param);
    }
}

module.exports = guilds_users;

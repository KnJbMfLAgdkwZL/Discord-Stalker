const model = require('../app_core/model.js');

class guilds_check extends model {
    insert_update(param) {
        param.check_cnt = 0;
        let data = this.select({guild_id: param['guild_id']});
        if (data) {
            if (param.users_in_voise <= 0)
                param.check_cnt = data[0].check_cnt + 1;
            this.update(param, {guild_id: param['guild_id']});
        }
        else
            this.insert(param);
    }
}

module.exports = guilds_check
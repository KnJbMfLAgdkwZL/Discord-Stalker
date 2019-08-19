const model = require('../app_core/model.js');

class messages_dm extends model {
    insert_if_not_found(param) {
        let data = this.select({
            channel_id: param.channel_id,
            message_id: param.message_id
        });
        if (!data) {
            this.insert(param);
        }
    }

    select_group_by_channel_id() {
        let sql = `SELECT * FROM ${this.table} GROUP BY channel_id`;
        return this.sql(sql);
    }
}

module.exports = messages_dm;

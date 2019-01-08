const model = require('../app_core/model.js')

class guilds extends model {
    insert_update(param) {
        let data = this.select({id: param.id})
        if (data)
            this.update(param, {id: param.id})
        else
            this.insert(param)
    }
}

module.exports = guilds
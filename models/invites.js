const model = require('../app_core/model.js')

class invites extends model {
    insert_update(param) {
        let data = this.select({url: param.url})
        if (data) {
            if (!param.guild_id)
                param.guild_id = data[0].guild_id
            if (!param.guild_name)
                param.guild_name = data[0].guild_name
            if (!param.guild_icon)
                param.guild_icon = data[0].guild_icon
            if (!param.inviter_id)
                param.inviter_id = data[0].inviter_id
            if (!param.inviter_username)
                param.inviter_username = data[0].inviter_username
            if (!param.inviter_discriminator)
                param.inviter_discriminator = data[0].inviter_discriminator
            if (!param.inviter_avatar)
                param.inviter_avatar = data[0].inviter_avatar
            if (!param.inviter_bot)
                param.inviter_bot = data[0].inviter_bot
            this.update(param, {url: param.url})
        }
        else
            this.insert(param)
    }
}

module.exports = invites


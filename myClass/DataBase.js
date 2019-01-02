const sqlite = require('sqlite-sync')

sqlite.connect('../main.db')

class DataBase {
    // Select() {}
    // Insert() {}
    // Update() {}
    // Delete() {}

    static Select_friends() {
        let sql = 'SELECT * FROM friends'
        let data = sqlite.run(sql)
        return data
    }

    static Insert_or_Update_guilds_check(param) {
        let guild_id = param['guild_id']
        param.check_cnt = 0
        let data = sqlite.run("SELECT * FROM guilds_check WHERE guild_id = ?", [guild_id])

        if (data.length > 0) {
            let guild = data[0]
            if (param.users_in_voise <= 0) {
                param.check_cnt = guild.check_cnt + 1
            }
            sqlite.update("guilds_check", param, {guild_id: guild_id})
        }
        else {
            sqlite.insert("guilds_check", param)
        }
    }

    static Select_guilds_check() {
        let data = sqlite.run('SELECT * FROM guilds_check ORDER BY frieds_in_voise DESC, users_in_voise DESC, frieds_on_server DESC, users_on_server DESC')
        return data
    }

    static Select_friends_by_id(id) {
        let sql = 'SELECT * FROM friends WHERE id = "' + id + '"'
        let data = sqlite.run(sql)
        return data
    }

    static Select_invites() {
        let sql = 'SELECT * FROM invites'
        let data = sqlite.run(sql)
        return data
    }

    static Select_invites_by_url(url) {
        let sql = 'SELECT * FROM invites WHERE url = "' + url + '"'
        let data = sqlite.run(sql)
        return data
    }

    static Insert_invite(url, guilds_id, name) {
        let data = sqlite.insert("invites",
            {
                'url': url,
                'guilds_id': guilds_id,
                'name': name
            })
        return data
    }

    static Update_invites(guilds_id, name) {
        let data = sqlite.update("invites", {name: name}, {guilds_id: guilds_id})
        return data
    }

    static Insert_friends_logs(param) {
        let data = sqlite.insert("friends_logs", param)
        return data
    }
}

module.exports = DataBase
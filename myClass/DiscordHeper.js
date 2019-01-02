const DataBase = require('./DataBase.js')
const DiscordAPI = require('./DiscordAPI.js')
const Helper = require('./Helper.js')


class DiscordHeper {
    constructor(token, client) {
        this.myAPI = new DiscordAPI(token)
        this.client = client

        let tmp = DataBase.Select_friends()
        let friends = {}
        for (let k in tmp) {
            let v = tmp[k]
            friends[v.id] = v
        }
        this.friends = friends

        this.calculating_members = 0
        this.members = []
    }

    SortGuilds() {
        let data = DataBase.Select_guilds_check()
        let arr = []
        for (let k in data) {
            let v = data[k]
            arr.push(v.guild_id)
        }
        this.myAPI.SortGuilds(arr)
    }

//----------------------------------------------------------------------------------------------------
    GetAllUrl() {
        function clearResult(data) {
            let result = []
            for (let k in data) {
                let str = data[k].match(new RegExp('https://discord.gg/([a-zA-Z0-9]+)'))
                if (str && str[0])
                    result.push(str[0])
            }
            return result
        }

        function removeDuplicat(data) {
            let tmp = {}
            for (let k in data)
                tmp[data[k]] = true
            let result = []
            for (let k in tmp)
                result.push(k)
            return result
        }

        let seze = this.client.guilds.size
        let result = []


        /*this.client.fetchInvite('https://discord.gg/8YPDucM').then(function (invite) {
            console.log(invite)
        }).catch(function (err) {
            console.log(err)
        })*/

        console.log(this.friends)


        /*
        this.client.guilds.forEach(function logMapElements(guild, guild_id) {
            guild.search({content: 'https://discord.gg/'}).then(res => {
                //let data = Helper.GetSearchResult(res)
                //Array.prototype.push.apply(result, clearResult(data))
                seze--
                if (!seze) {
                    //console.log(result.length)
                    //result = removeDuplicat(result)
                }
            }).catch(console.error)
        })
        */

    }

//----------------------------------------------------------------------------------------------------
    LogUsersGuilds() {
        this.calculating_members = 1
        let _this = this
        let guilds_size = this.client.guilds.size
        this.client.guilds.forEach(function logMapElements(guild, guild_id) {
            guild.fetchMembers().then(function (_guild) {
                let result = {
                    guild_id: _guild.id,
                    guild_name: _guild.name,
                    users_on_server: 0,
                    users_in_voise: 0,
                    frieds_on_server: 0,
                    frieds_in_voise: 0
                }
                result.users_on_server = _guild.members.size
                for (let key in _this.friends)
                    if (guild.members.get(key))
                        result.frieds_on_server++
                _guild.channels.forEach(function logMapElements(channel, channel_id) {
                    if (channel.type !== 'voice')
                        return
                    result.users_in_voise += channel.members.size
                    for (let key in _this.friends)
                        if (channel.members.get(key))
                            result.frieds_in_voise++
                })
                DataBase.Insert_or_Update_guilds_check(result)
                guilds_size--
                if (guilds_size <= 0) {
                    _this.calculating_members = 0
                    console.log('Done from test()')
                }
            })
        })
    }

//----------------------------------------------------------------------------------------------------
    FindFriends() {
        let _this = this
        let guilds = []
        this.client.guilds.forEach(function logMapElements(guild, key) {
            let _guild = _this.FindFriends_InVoice(guild)
            if (_guild)
                guilds.push(_guild)
        })
        if (guilds.length) {
            guilds.sort(function (a, b) {
                if (a.friends_length > b.friends_length)
                    return -1;
                if (a.friends_length < b.friends_length)
                    return 1;
                return 0;
            })
            return guilds
        }
        return false
    }

    FindFriends_InVoice(guild) {
        let _guild = {
            id: guild.id,
            name: guild.name,
            icon: guild.icon,
            friends_length: 0,
            channels: {}
        }
        let channels = {}
        let friends = this.friends
        guild.channels.forEach(function logMapElements(channel, key) {
            if (channel.type !== 'voice')
                return
            channel.members.forEach(function logMapElements(member, key) {
                let user_info = {
                    username: member.user.username,
                    user_id: member.user.id,
                    nickname: member.nickname,
                    discriminator: member.user.discriminator,
                    avatar: member.user.avatar,
                    bot: member.user.bot,
                    friend: false
                }
                if (!channels[channel.id])
                    channels[channel.id] = {
                        channel_id: channel.id,
                        channel_name: channel.name,
                        users: []
                    }
                channels[channel.id].users.push(user_info)
                if (friends[member.user.id]) {
                    user_info.friend = true
                    _guild.friends_length++
                    _guild.channels[channel.id] = channels[channel.id]
                }
            })
        })
        if (Object.keys(_guild.channels).length)
            return _guild
        return false
    }
}

module.exports = DiscordHeper
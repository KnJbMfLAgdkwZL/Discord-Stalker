const api_helper = require('./api_helper')
let discord_api = new (require('./discord_api'))
let friends = new (require('../models/friends'))
let invites = new (require('../models/invites'))
let invites_dead = new (require('../models/invites_dead'))
let guilds_check = new (require('../models/guilds_check'))
let _this

class discord_heper {
    constructor(client) {
        _this = this
        _this.client = client

        let tmp = friends.select()
        let _friends = {}
        for (let k in tmp) {
            let v = tmp[k]
            _friends[v.id] = v
        }

        _this.friends = _friends
        _this.calculating_members = 0
    }

//----------------------------------------------------------------------------------------------------
    Sort_guilds_from_db() {
        let data = guilds_check.select({}, {
            frieds_in_voise: 'DESC',
            users_in_voise: 'DESC',
            frieds_on_server: 'DESC',
            users_on_server: 'DESC'
        })
        let arr = []
        for (let k in data)
            arr.push(data[k].guild_id)
        discord_api.SortGuilds(arr)
    }

    clear_res_urls(res) {
        res = api_helper.GetSearchResult(res)
        res = api_helper.clearResult(res)
        res = api_helper.removeDuplicat(res)
        for (let k in res) {
            let row = {
                url: res[k],
                guild_id: '',
                guild_name: '',
                guild_icon: '',
                inviter_id: '',
                inviter_username: '',
                inviter_discriminator: '',
                inviter_avatar: '',
                inviter_bot: ''
            }
            _this.check_url(row)
        }
    }

    check_url(row) {
        _this.client.fetchInvite(row.url).then(function (invite) {
            if (invite) {
                if (invite.guild) {
                    if (invite.guild.id)
                        row.guild_id = invite.guild.id
                    if (invite.guild.name)
                        row.guild_name = invite.guild.name
                    if (invite.guild.icon)
                        row.guild_icon = invite.guild.icon
                }
                if (invite.inviter) {
                    if (invite.inviter.id)
                        row.inviter_id = invite.inviter.id
                    if (invite.inviter.username)
                        row.inviter_username = invite.inviter.username
                    if (invite.inviter.discriminator)
                        row.inviter_discriminator = invite.inviter.discriminator
                    if (invite.inviter.avatar)
                        row.inviter_avatar = invite.inviter.avatar
                    if (invite.inviter.bot)
                        row.inviter_bot = invite.inviter.bot
                }
                invites.insert_update(row, {url: row.url})
            }
        }).catch(function (err) {
            invites.delete({url: row.url})
            invites_dead.insert_update(row)
        })
    }

    Search_guild_urls(guild) {
        guild.search({content: 'https://discord.gg/'}).then(res => {
            _this.clear_res_urls(res)
        }).catch(function (err) {
            console.log(err)
        })
    }

    Search_all_urls() {
        _this.client.guilds.forEach(function logMapElements(guild, guild_id) {
            _this.Search_guild_urls(guild)
        })
    }

    Check_urls_in_db() {
        let data = invites.select()
        for (let k in data) {
            let row = data[k]
            _this.check_url(row)
        }
    }

    Log_users_guilds() {
        _this.calculating_members = 1
        let guilds_size = _this.client.guilds.size
        _this.client.guilds.forEach(function logMapElements(guild, guild_id) {
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
                guilds_check.insert_update(result)
                guilds_size--
                if (guilds_size <= 0) {
                    _this.calculating_members = 0
                }
            }).catch(function (err) {
                console.log(err)
            })
        })
    }

    Find_friends() {
        let guilds = []
        _this.client.guilds.forEach(function logMapElements(guild, key) {
            let _guild = _this.Find_friends_in_voice(guild)
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

    Find_friends_in_voice(guild) {
        let _guild = {
            id: guild.id,
            name: guild.name,
            icon: guild.icon,
            friends_length: 0,
            channels: {}
        }
        let channels = {}
        let friends = _this.friends
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

module.exports = discord_heper
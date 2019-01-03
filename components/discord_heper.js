const discord_api = require('./discord_api')

const api_helper = require('./api_helper')

let friends = new require('../models/friends')
friends = new friends()

let invites = require('../models/invites')
invites = new invites()

let invites_dead = require('../models/invites_dead')
invites_dead = new invites_dead()

let guilds_check = require('../models/guilds_check')
guilds_check = new guilds_check()

let _this


class discord_heper {
    constructor(client) {
        _this = this

        this.myAPI = new discord_api()

        this.client = client

        let tmp = friends.select()
        let _friends = {}
        for (let k in tmp) {
            let v = tmp[k]
            _friends[v.id] = v
        }
        this.friends = _friends

        this.calculating_members = 0
    }

//----------------------------------------------------------------------------------------------------
    SortGuilds() {
        let data = guilds_check.select({}, {
            frieds_in_voise: 'DESC',
            users_in_voise: 'DESC',
            frieds_on_server: 'DESC',
            users_on_server: 'DESC'
        })
        let arr = []
        for (let k in data) {
            let v = data[k]
            arr.push(v.guild_id)
        }
        this.myAPI.SortGuilds(arr)
    }

//----------------------------------------------------------------------------------------------------
    search_guild_urls(guild) {
        guild.search({content: 'https://discord.gg/'}).then(res => {
            let data = api_helper.GetSearchResult(res)
            data = api_helper.clearResult(data)
            data = api_helper.removeDuplicat(data)
            for (let k in data) {
                let row = {
                    url: data[k],
                    guild_id: '',
                    guild_name: '',
                    guild_icon: '',
                    inviter_id: '',
                    inviter_username: '',
                    inviter_discriminator: '',
                    inviter_avatar: '',
                    inviter_bot: ''
                }
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
                    invites_dead.insert_update(row)
                })
            }
        }).catch(function (err) {
            console.log(err)
        })

    }

//----------------------------------------------------------------------------------------------------
    search_all_urls() {
        let size = this.client.guilds.size
        let result = []
        this.client.guilds.forEach(function logMapElements(guild, guild_id) {
            guild.search({content: 'https://discord.gg/'}).then(res => {
                let data = api_helper.GetSearchResult(res)
                Array.prototype.push.apply(result, api_helper.clearResult(data))
                size--
                if (!size) {
                    result = removeDuplicat(result)
                    for (let k in result) {
                        let row = {
                            url: result[k],
                            guild_id: '',
                            guild_name: '',
                            guild_icon: '',
                            inviter_id: '',
                            inviter_username: '',
                            inviter_discriminator: '',
                            inviter_avatar: '',
                            inviter_bot: ''
                        }
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
                            invites_dead.insert_update(row)
                        })
                    }
                }
            })
        })
    }

//----------------------------------------------------------------------------------------------------
    check_urls_in_db() {
        let data = invites.select()
        for (let k in data) {
            let row = data[k]
            this.client.fetchInvite(row.url).then(function (invite) {
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
                    invites.update(row, {url: row.url})
                }
            }).catch(function (err) {
                invites.delete({
                    url: row.url
                })
                invites_dead.insert_update(row)
            })

        }
    }

//----------------------------------------------------------------------------------------------------
    LogUsersGuilds() {
        this.calculating_members = 1
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
                guilds_check.insert_update(result)
                guilds_size--
                if (guilds_size <= 0) {
                    _this.calculating_members = 0
                }
            })
        })
    }

//----------------------------------------------------------------------------------------------------
    FindFriends() {
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

module.exports = discord_heper
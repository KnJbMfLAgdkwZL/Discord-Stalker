const api_helper = require('./api_helper')
let discord_api = new (require('./discord_api'))
let friends = new (require('../models/friends'))
let invites = new (require('../models/invites'))
let invites_dead = new (require('../models/invites_dead'))
let guilds_check = new (require('../models/guilds_check'))
let friends_logs = new (require('../models/friends_logs'))
let messages_dm = new (require('../models/messages_dm'))

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

    Friends_logs(param) {
        if (_this.friends[param.user_id])
            friends_logs.insert(param)
    }

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

    Log_dm_messages() {
        _this.client.channels.forEach(function (channel, channel_id) {
            if (channel.type == 'dm') {
                function fetchMessages(messages) {
                    try {
                        let size = messages.size
                        let lastMessageID = ''
                        messages.forEach(function (message, message_id) {
                            let data = {
                                channel_id: '',
                                channel_recipient_id: '',
                                channel_recipient_username: '',
                                message_id: '',
                                message_content: '',
                                message_author_id: '',
                                message_author_username: '',
                                message_author_discriminator: '',
                                message_author_avatar: '',
                                message_createdTimestamp: '',
                                attachments: ''
                            }
                            if (channel) {
                                if (channel.id)
                                    data.channel_id = channel.id
                                if (channel.recipient) {
                                    if (channel.recipient.id)
                                        data.channel_recipient_id = channel.recipient.id
                                    if (channel.recipient.username)
                                        data.channel_recipient_username = channel.recipient.username
                                }
                            }
                            if (message) {
                                if (message.id)
                                    data.message_id = message.id
                                if (message.content)
                                    data.message_content = message.content
                                if (message.createdTimestamp) {
                                    let date = new Date();
                                    date.setTime(message.createdTimestamp)
                                    date = date.toLocaleString()
                                    data.message_createdTimestamp = date
                                }
                                if (message.author) {
                                    if (message.author.id)
                                        data.message_author_id = message.author.id
                                    if (message.author.username)
                                        data.message_author_username = message.author.username
                                    if (message.author.discriminator)
                                        data.message_author_discriminator = message.author.discriminator
                                    if (message.author.avatar)
                                        data.message_author_avatar = message.author.avatar
                                }
                            }
                            let attachments = ''
                            message.attachments.forEach(function (attachment, attachment_id) {
                                let str = ''
                                if (attachment.url)
                                    str += attachment.url + '\n'
                                else if (attachment.proxyURL)
                                    str += attachment.proxyURL + '\n'
                                attachments += str
                            })
                            data.attachments = attachments

                            try {
                                messages_dm.insert_if_not_found(data)
                            }
                            catch (err) {
                                console.log(err)
                            }
                            size--
                            if (!size)
                                lastMessageID = message_id
                        })
                        if (messages.size >= 100)
                            channel.fetchMessages({
                                limit: 100,
                                before: lastMessageID
                            }).then(fetchMessages).catch(console.error)
                    } catch (err) {
                        console.log(err)
                    }
                }

                channel.fetchMessages({
                    limit: 100,
                }).then(fetchMessages).catch(console.error)
            }
        })
    }

    Get_dm_chanels_from_db() {
        let data = messages_dm.select_group_by_channel_id()
        return data
    }

    Get_dm_chanel_from_db(channel_id) {
        let data = messages_dm.select({channel_id: channel_id})
        for (let k in data) {
            let val = data[k]
            let attachments = val.attachments.split('\n')
            val.attachments = {}
            for (let a_k in attachments) {
                let val_a = attachments[a_k]
                let arr = val_a.split('.')
                let type = arr[arr.length - 1]
                if (type == 'png' || type == 'jpg' || type == 'gif' ||
                    type == 'PNG' || type == 'JPG' || type == 'GIF'
                ) {
                    if (!val.attachments.img)
                        val.attachments.img = []
                    val.attachments.img.push(val_a)
                }
                else {
                    if (!val.attachments.others)
                        val.attachments.others = []
                    val.attachments.others.push(val_a)
                }
            }
        }
        //console.log(data)
        return data
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

module
    .exports = discord_heper
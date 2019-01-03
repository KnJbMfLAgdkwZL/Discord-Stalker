let friends_logs = require('../models/friends_logs')
friends_logs = new friends_logs()


let client

class discord_controllers {
    constructor() {
        const fs = require('fs')
        let config = JSON.parse(fs.readFileSync('../config.json', 'utf8'))
        let token = config.token
        const discord = require('discord.js')
        client = new discord.Client()
        this.client = client
        client.on('ready', this.ready)
        //client.on('voiceStateUpdate', this.voiceStateUpdate)
        client.login(token)
    }

    ready() {
        console.log(`Logged in as ${client.user.tag}`)
        console.log()
        //discordHeper.GetAllUrl()
        //discordHeper.SortGuilds()
        //discordHeper.LogUsersGuilds()
    }

    voiceStateUpdate(oldMember, newMember) {
        let newUserChannel = newMember.voiceChannel
        let oldUserChannel = oldMember.voiceChannel
        let user_channel = false
        let member = false
        let param = {}
        if (oldUserChannel === undefined && newUserChannel !== undefined) {
            param.status = 'Join'
            user_channel = newUserChannel
            member = newMember
        }
        else if (newUserChannel === undefined) {
            param.status = 'Leave'
            user_channel = oldUserChannel
            member = oldMember
        }
        if (user_channel && member) {
            param.guild_name = user_channel.guild.name
            param.guild_id = user_channel.guild.id
            param.channel_name = user_channel.name
            param.channel_id = user_channel.id
            param.user_name = member.user.username
            param.user_id = member.user.id
            param.date_time = new Date().toString()
            friends_logs.insert(param)
        }
    }
}

module.exports = discord_controllers
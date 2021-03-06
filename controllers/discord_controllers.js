let client;

class discord_controllers {
    constructor() {
        const fs = require('fs');
        let config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));
        this.token = config.token;
        const discord = require('discord.js');
        client = new discord.Client();
        this.client = client;
        client.on('ready', this.ready);
        client.on('voiceStateUpdate', this.voiceStateUpdate);
    }

    login() {
        client.login(this.token);
    }

    ready() {
        require('../global').discord_heper.client = client;
        console.log(`Logged in as ${client.user.tag}`);
        console.log();

        require('../global').http_controllers.start();

        //console.log(client.user.notes);



        //let discord_heper = require('../global').discord_heper;
        //discord_heper.start_join();
        //discord_heper.Log_users_guilds();
        //discord_heper.Search_all_urls01bad();
        //discord_heper.get_users_from_all_guilds();
    }

    voiceStateUpdate(oldMember, newMember) {
        let newUserChannel = newMember.voiceChannel;
        let oldUserChannel = oldMember.voiceChannel;
        let user_channel = false;
        let member = false;
        let param = {
            guild_name: null,
            guild_id: null,
            channel_name: null,
            channel_id: null,
            user_name: null,
            user_id: null,
            date_time: null
        };
        if (oldUserChannel === undefined && newUserChannel !== undefined) {
            param.status = 'Join';
            user_channel = newUserChannel;
            member = newMember;
        } else if (newUserChannel === undefined) {
            param.status = 'Leave';
            user_channel = oldUserChannel;
            member = oldMember;
        }
        if (user_channel && member) {
            if (user_channel.guild) {
                if (user_channel.guild.name)
                    param.guild_name = user_channel.guild.name;
                if (user_channel.guild.id)
                    param.guild_id = user_channel.guild.id;
            }
            if (user_channel.name)
                param.channel_name = user_channel.name;
            if (user_channel.id)
                param.channel_id = user_channel.id;
            if (member.user) {
                if (member.user.username)
                    param.user_name = member.user.username;
                if (member.user.id)
                    param.user_id = member.user.id;
            }
            param.date_time = new Date().toString();
            require('../global').discord_heper.Friends_logs(param);

        }
    }
}

module.exports = new discord_controllers();

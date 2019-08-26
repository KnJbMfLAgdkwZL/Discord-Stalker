class http_controllers {
    constructor() {
        const express = require('express');
        const app = express();
        const bodyParser = require("body-parser");
        app.use(bodyParser.urlencoded({
            extended: true
        }));
        app.use(express.json());
        const handlebars = require('express-handlebars');
        const path = require('path');

        app.engine('.hbs', handlebars({
            defaultLayout: 'main',
            extname: '.hbs',
            layoutsDir: path.join(__dirname, '../views/layouts')
        }));
        app.set('view engine', '.hbs');
        app.set('views', path.join(__dirname, '../views'));
        app.disable('view cache');

        app.get('/find_friends', http_controllers.find_friends);
        app.get('/show_dm_channels', http_controllers.show_dm_channels);
        app.get('/show_dm_channel', http_controllers.show_dm_channel);
        app.get('/edit_friends', http_controllers.edit_friends);
        app.get('/delete_friend', http_controllers.delete_friend);
        app.get('/friend_info', this.friend_info);
        app.get('/guilds', this.guilds);
        app.get('/guild_leave', this.guild_leave);
        app.get('/bot_settings', http_controllers.bot_settings);
        app.get('/bot_status', http_controllers.bot_status);
        app.get('/', http_controllers.home);
        app.get('/', http_controllers.home);

        app.post('/add_friend', http_controllers.add_friend);
        app.post('/guild_add', this.guild_add);
        app.post('/status_edit', this.status_edit);

        app.get('/download_Main_db', http_controllers.download_Main_db);
        app.get('/download_Error_Log', http_controllers.download_Error_Log);
        app.get('/Clear_Error_Log', http_controllers.Clear_Error_Log);
        app.get('/Show_Error_Log', http_controllers.Show_Error_Log);

        app.get('/guild', http_controllers.guild);

        app.get('/guild_members', http_controllers.guild_members);
        app.get('/guild_channels', http_controllers.guild_channels);
        app.get('/guild_text_channel', http_controllers.guild_text_channel);
        app.get('/guild_text_channel_messages', http_controllers.guild_text_channel_messages);
        app.get('/get_user_by_id', http_controllers.get_user_by_id);

        const port = 3000;
        app.listen(port, (err) => {
            if (err) return console.log('something bad happened', err);
            console.log(`http server is listening on 3000`);
            console.log(`    http://localhost:${port}/`);
        });
    }

    static get_user_by_id(request, response) {
        let user_id = `${request.query.id}`;
        let client = require('../global').discord_controllers.client;
        client.fetchUser(user_id).then(value => {
            let u = {
                avatar: value.avatar,
                avatarURL: value.avatarURL,
                defaultAvatarURL: value.defaultAvatarURL,
                displayAvatarURL: value.displayAvatarURL,
                bot: value.bot,
                createdAt: value.createdAt,
                noteD: value.note,
                id: value.id,
                tag: value.tag,
                username: value.username,
                discriminator: value.discriminator
            };
            let data = JSON.stringify(u);
            response.send(`${data}`);
        }).catch(reason => {
            response.send(`error get_user_by_id`);
        });
    }

    static guild_text_channel_messages(request, response) {
        let channel_id = `${request.query.id}`;
        let lastMessageID = `${request.query.lastMessageID}`;
        let client = require('../global').discord_controllers.client;
        client.syncGuilds();
        let channel = client.channels.get(channel_id);
        let options = {limit: 100};
        if (lastMessageID !== 'undefined')
            options.before = lastMessageID;
        channel.fetchMessages(options).then(messages => {
            let m = http_controllers.messages_to_array(messages);
            let data = JSON.stringify(m);
            response.send(`${data}`);
        }).catch(reason => {
            response.send(`${reason}`);
        });
    }

    static guild_text_channel(request, response) {
        let channel_id = `${request.query.id}`;
        let client = require('../global').discord_controllers.client;
        client.syncGuilds();
        let channel = client.channels.get(channel_id);
        let data = {
            channel_id: channel_id,
            channel_name: channel.name,
            guild_id: channel.guild.id,
            guild_name: channel.guild.name,
        };
        response.render('guild_text_channel', {data: data});
    }

    static get_AVATAR(user) {
        let avatar = user.avatarURL;
        if (!avatar) {
            avatar = user.displayAvatarURL;
            if (!avatar)
                avatar = user.defaultAvatarURL;
        }
        return avatar;
    }

    static get_NAME(user) {
        let name = user.tag;
        if (!name) {
            name = user.username;
            if (!name)
                name = user.id;
        }
        return name;
    }

    static messages_to_array(messages) {
        let data = [];
        for (let [k, v] of messages) {
            try {
                let message = {};
                message.id = v.id;
                message.content = v.content;
                message.createdAt = v.createdAt;
                message.user_id = v.author.id;
                message.user_name = http_controllers.get_NAME(v.author);
                message.user_avatar = http_controllers.get_AVATAR(v.author);
                message.attachments = [];
                for (let [ka, a] of v.attachments) {
                    let attachment = {};
                    attachment.url = a.url;
                    attachment.proxyURL = a.proxyURL;
                    message.attachments.push(attachment)
                }
                data.push(message);
            } catch (e) {
                console.log(e);
            }
        }
        return data;
    }

    static guild_channels(request, response) {
        let id = `${request.query.id}`;
        let client = require('../global').discord_controllers.client;
        client.syncGuilds();
        let guild = client.guilds.get(id);

        let TextChannels = [];
        let VoiceChannels = [];
        for (let [k, v] of guild.channels) {
            if (v.type === 'voice') {
                let channel = {
                    id: v.id,
                    name: v.name,
                    members: []
                };
                for (let [ke, va] of v.members) {
                    let user = va.user;
                    user.AVATAR = user.avatarURL;
                    if (!user.AVATAR) {
                        user.AVATAR = user.displayAvatarURL;
                        if (!user.AVATAR)
                            user.AVATAR = user.defaultAvatarURL;
                    }
                    channel.members.push(user);
                }
                VoiceChannels.push(channel);
            } else if (v.type === 'text') {
                TextChannels.push(v);
            }
        }
        response.render('guild_channels', {VoiceChannels: VoiceChannels, TextChannels: TextChannels});
        //response.send('ok');
    }

    static guild_members(request, response) {
        let id = `${request.query.id}`;
        let avatar = `${request.query.avatar}` === '1';
        let client = require('../global').discord_controllers.client;
        client.syncGuilds();
        let guild = client.guilds.get(id);
        guild.fetchMembers().then(value => {
            let members = value.members;
            let arr = [];
            for (let [k, v] of members) {
                let user = v.user;
                user.joinedAt = v.joinedAt;

                if (avatar) {
                    user.AVATAR = user.avatarURL;
                    if (!user.AVATAR) {
                        user.AVATAR = user.displayAvatarURL;
                        if (!user.AVATAR)
                            user.AVATAR = user.defaultAvatarURL;
                    }
                } else
                    user.AVATAR = false;
                arr.push(user);
            }
            response.render('guild_members', {members: arr});
        }).catch(reason => {
            response.send(`<pre>${reason}</pre>`);
        });
    }

    static guild(request, response) {
        let id = `${request.query.id}`;
        let client = require('../global').discord_controllers.client;
        client.syncGuilds();
        let guild = client.guilds.get(id);
        response.render('guild', {guild: guild});
    }

    static Show_Error_Log(request, response) {
        const file = `${__dirname}/../error_log.txt`;
        let fs = require('fs');
        let contents = fs.readFileSync(file, 'utf8');
        response.send(`<pre>${contents}</pre>`);
    }

    static download_Main_db(request, response) {
        const file = `${__dirname}/../main.db`;
        response.download(file);
    }

    static download_Error_Log(request, response) {
        const file = `${__dirname}/../error_log.txt`;
        response.download(file);
    }

    static Clear_Error_Log(request, response) {
        let fs = require('fs');
        fs.writeFile(`${__dirname}/../error_log.txt`,
            '', () => {
                response.redirect('./bot_settings');
                response.end();
            }
        );
    }

    static home(request, response) {
        response.render('home');
    }

    static bot_status(request, response) {
        let clientUser = require('../global').discord_controllers.client.user;
        let status = clientUser.settings.status;
        response.send(status);
    }

    status_edit(request, response) {
        let status = `${request.body.status}`;
        let clientUser = require('../global').discord_controllers.client.user;
        clientUser.setStatus(status).then(() => {
            response.redirect('./bot_settings');
            response.end();
        }).catch(reason => {
            response.send(JSON.stringify(reason));
        });
    }

    static bot_settings(request, response) {
        let clientUser = require('../global').discord_controllers.client.user;
        let status = clientUser.settings.status;
        response.render('bot_settings', {status: status});
    }

    guild_add(request, response) {
        let global = require('../global');
        global.discord_heper.Acceptinvites(`${request.body.url}`);
        global.discord_controllers.client.fetchInvite(`${request.body.url}`).then(() => {
            response.redirect('./guilds');
            response.end();
        }).catch(reason => {
            response.render('guild_add_error', {reason: reason});
        });
    }

    guild_leave(request, response) {
        let guild = require('../global').discord_controllers.client.guilds.get(`${request.query.id}`);
        guild.leave().then(() => {
            response.redirect('./guilds');
            response.end();
        }).catch(reason => {
            response.send(JSON.stringify(reason));
        });
    }

    guilds(request, response) {
        let client = require('../global').discord_controllers.client;
        client.syncGuilds(client.guilds);
        let arr = [];
        require('../global').discord_controllers.client.guilds.forEach(v => {
            arr.push(v);
        });
        response.render('guilds', {guilds: arr});
    }

    friend_info(request, response) {
        let id = `${request.query.id}`;
        let global = require('../global');
        global.discord_controllers.client.fetchUser(id).then(user => {
            user.AVATAR = user.avatarURL;
            if (!user.AVATAR) {
                user.AVATAR = user.displayAvatarURL;
                if (!user.AVATAR)
                    user.AVATAR = user.defaultAvatarURL;
            }
            user.fetchProfile().then(userProfile => {
                let arr = [];
                userProfile.mutualGuilds.forEach(v => {
                    arr.push(v);
                });
                userProfile.mutualGuilds = arr;
                response.render('friend_info', {userProfile: userProfile});
            }).catch(reason => {
                let userProfile = {
                    user: user
                };
                let profile = global.discord_api.GetProfile(id);
                let error = `${reason}\n${JSON.stringify(profile, undefined, 2)}`;
                response.render('friend_info', {userProfile: userProfile, error: error});
            });

        }).catch(reason => {
            let user = global.discord_api.GetUser(id);
            let profile = global.discord_api.GetProfile(id);
            let error = `${reason}\n`;
            error += `${JSON.stringify(user, undefined, 2)}\n`;
            error += `${JSON.stringify(profile, undefined, 2)}\n`;
            response.render('friend_info', {userProfile: {}, error: error});
        });
    }

    static delete_friend(request, response) {
        require('../global').discord_heper.deletefriend(request.query.id);
        response.redirect('./edit_friends');
        response.end();
    }

    static add_friend(request, response) {
        require('../global').discord_heper.addfriend(request.body.id, request.body.name);
        response.redirect('./edit_friends');
        response.end();
    }

    static edit_friends(request, response) {
        let friends = require('../global').discord_heper.friends_select();
        response.render('edit_friends', {friends: friends});
    }

    static find_friends(request, response) {
        let guilds = require('../global').discord_heper.Find_friends();
        response.render('find_friends', {guilds: guilds});
    }

    static show_dm_channels(request, response) {
        let channels = require('../global').discord_heper.Get_dm_chanels_from_db();
        response.render('show_dm_channels', {channels: channels});
    }

    static show_dm_channel(request, response) {
        let channel_id = request.query.channel_id;
        let messages = require('../global').discord_heper.Get_dm_chanel_from_db(channel_id);
        response.render('show_dm_channel', {messages: messages});
    }
}

module.exports = new http_controllers();
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
        app.get('/guild_roles', http_controllers.guild_roles);
        app.get('/guild_systemChannel', http_controllers.guild_systemChannel);

        const port = 3000;
        app.listen(port, (err) => {
            if (err) return console.log('something bad happened', err);
            console.log(`http server is listening on 3000`);
            console.log(`    http://localhost:${port}/`);
        });
    }

    static guild_members(request, response) {
        let id = `${request.query.id}`;
        let client = require('../global').discord_controllers.client;
        client.syncGuilds();
        let guild = client.guilds.get(id);
        guild.fetchMembers().then(value => {
            let members = value.members;
            let arr = [];
            for (let [k, v] of members) {
                let user = v.user;
                user.AVATAR = user.avatarURL;
                if (!user.AVATAR) {
                    user.AVATAR = user.displayAvatarURL;
                    if (!user.AVATAR)
                        user.AVATAR = user.defaultAvatarURL;
                }
                user.joinedAt = v.joinedAt;
                arr.push(user);
            }
            response.render('guild_members', {members: arr});
        }).catch(reason => {
            response.send(`<pre>${reason}</pre>`);
        });
    }

    static guild_channels(request, response) {
        // let id = `${request.query.id}`;
        // let client = require('../global').discord_controllers.client;
        // client.syncGuilds();
        // let guild = client.guilds.get(id);
        // response.render('guild_channels', {guild: guild});
    }

    static guild_roles(request, response) {
        // let id = `${request.query.id}`;
        // let client = require('../global').discord_controllers.client;
        // client.syncGuilds();
        // let guild = client.guilds.get(id);
        // response.render('guild_roles', {guild: guild});
    }

    static guild_systemChannel(request, response) {
        // let id = `${request.query.id}`;
        // let client = require('../global').discord_controllers.client;
        // client.syncGuilds();
        // let guild = client.guilds.get(id);
        // response.render('guild_systemChannel', {guild: guild});
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
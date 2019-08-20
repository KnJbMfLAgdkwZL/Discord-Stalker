class http_controllers {
    constructor() {
        const express = require('express');
        const app = express();
        const bodyParser = require("body-parser");
        app.use(bodyParser.urlencoded({
            extended: true
        }));
        app.use(express.json());
        const exphbs = require('express-handlebars');
        const path = require('path');
        app.engine('.hbs', exphbs({
            defaultLayout: 'main',
            extname: '.hbs',
            layoutsDir: path.join(__dirname, '../views/layouts')
        }));
        app.set('view engine', '.hbs');
        app.set('views', path.join(__dirname, '../views'));
        app.disable('view cache');

        app.get('/findfriends', this.findfriends);
        app.get('/showdmchanels', this.showdmchanels);
        app.get('/showdmchanel', this.showdmchanel);
        app.get('/editfriends', this.editfriends);
        app.get('/deletefriend', this.deletefriend);
        app.get('/friendinfo', this.friendinfo);
        app.get('/guilds', this.guilds);
        app.get('/guild_leave', this.guild_leave);
        app.get('/botsettings', this.botsettings);
        app.get('/botstatus', this.botstatus);
        app.get('/', this.home);
        app.get('/', this.home);

        app.post('/addfriend', this.addfriend);
        app.post('/guild_add', this.guild_add);
        app.post('/status_edit', this.status_edit);

        const port = 3000;
        app.listen(port, (err) => {
            if (err) return console.log('something bad happened', err);
            console.log(`http server is listening on 3000`);
            console.log(`\thttp://localhost:${port}/findfriends`);
            console.log(`\thttp://localhost:${port}/showdmchanels`);
        });
    }

    home(request, response) {
        response.render('home');
    }

    botstatus(request, response) {
        let clientUser = require('../global').discord_controllers.client.user;
        let status = clientUser.settings.status;
        response.send(status);
    }

    status_edit(request, response) {
        let status = `${request.body.status}`;
        let clientUser = require('../global').discord_controllers.client.user;
        clientUser.setStatus(status).then(value => {
            response.redirect('./botsettings');
            response.end();
        }).catch(reason => {
            console.log(reason);
        });
    }

    botsettings(request, response) {
        let clientUser = require('../global').discord_controllers.client.user;
        let status = clientUser.settings.status;
        response.render('botsettings', {status: status});
    }

    guild_add(request, response) {
        let global = require('../global');
        global.discord_heper.Acceptinvites(`${request.body.url}`)
        global.discord_controllers.client.fetchInvite(`${request.body.url}`).then(invite => {
            response.redirect('./guilds');
            response.end();
        }).catch(reason => {
            response.render('guild_add_erroe', {reason: reason});
        });
    }

    guild_leave(request, response) {
        let guild = require('../global').discord_controllers.client.guilds.get(`${request.query.id}`);
        guild.leave().then(v => {
            response.redirect('./guilds');
            response.end();
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

    friendinfo(request, response) {
        require('../global').discord_controllers.client.fetchUser(`${request.query.id}`).then(user => {
            user.fetchProfile().then(userProfile => {
                let arr = [];
                userProfile.mutualGuilds.forEach(v => {
                    arr.push(v);
                });
                userProfile.mutualGuilds = arr;
                response.render('friendinfo', {userProfile: userProfile});
            });
        });
    }

    deletefriend(request, response) {
        require('../global').discord_heper.deletefriend(request.query.id);
        response.redirect('./editfriends');
        response.end();
    }

    addfriend(request, response) {
        require('../global').discord_heper.addfriend(request.body.id, request.body.name);
        response.redirect('./editfriends');
        response.end();
    }

    editfriends(request, response) {
        let friends = require('../global').discord_heper.friends_select();
        response.render('editfriends', {friends: friends});
    }

    findfriends(request, response) {
        let guilds = require('../global').discord_heper.Find_friends();
        response.render('findfriends', {guilds: guilds});
    }

    showdmchanels(request, response) {
        let chanels = require('../global').discord_heper.Get_dm_chanels_from_db();
        response.render('showdmchanels', {
            chanels: chanels
        });
    }

    showdmchanel(request, response) {
        let channel_id = request.query.channel_id;
        let messages = require('../global').discord_heper.Get_dm_chanel_from_db(channel_id);
        response.render('showdmchanel', {
            messages: messages
        });
    }
}

module
    .exports = new http_controllers();
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

        app.post('/addfriend', this.addfriend);

        const port = 3000;
        app.listen(port, (err) => {
            if (err) return console.log('something bad happened', err);
            console.log(`http server is listening on 3000`);
            console.log(`\thttp://localhost:${port}/findfriends`);
            console.log(`\thttp://localhost:${port}/showdmchanels`);
        });
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

        //console.log(user);
        //user.fetchProfile().then(console.log)
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

module.exports = new http_controllers();
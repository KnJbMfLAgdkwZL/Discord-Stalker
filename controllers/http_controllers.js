class http_controllers {
    constructor() {
        const express = require('express');
        const app = express();

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

        const port = 3000;
        app.listen(port, (err) => {
            if (err) return console.log('something bad happened', err);

            console.log(`http server is listening on 3000`);
            console.log(`\thttp://localhost:${port}/findfriends`);
            console.log(`\thttp://localhost:${port}/showdmchanels`);
        });
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
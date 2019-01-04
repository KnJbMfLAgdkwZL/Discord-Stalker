let discord_heper

class http_controllers {
    constructor(dic_help) {
        discord_heper = dic_help

        const express = require('express')
        const app = express()

        const exphbs = require('express-handlebars')
        const path = require('path')

        app.engine('.hbs', exphbs({
            defaultLayout: 'main',
            extname: '.hbs',
            layoutsDir: path.join(__dirname, '../views/layouts')
        }))

        app.set('view engine', '.hbs')
        app.set('views', path.join(__dirname, '../views'))
        app.disable('view cache')

        app.get('/findfriends', this.findfriends)
        app.get('/qwe', this.qwe)
        app.get('/test', this.test)

        const port = 3000
        app.listen(port, (err) => {
            if (err) return console.log('something bad happened', err)
            console.log(`server is listening on ${port}`)
        })
    }

    findfriends(request, response) {
        let guilds = discord_heper.Find_friends()
        response.render('index', {guilds: guilds})
    }

    qwe(request, response) {
        /*
        discordHeper.test()
        const sleep = require('system-sleep')
        while (discordHeper.calculating_members)
            sleep(1000)
        console.log('Done')
        */
        let guilds = 12312321
        response.render('qwe', {
            guilds: guilds
        })
    }

    test(request, response) {
        response.render('test')
    }
}

module.exports = http_controllers
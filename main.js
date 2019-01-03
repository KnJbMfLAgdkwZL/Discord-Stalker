const Discord = require('discord.js')

const DiscordHeper = require('./components/discord_heper')

const fs = require('fs')
let config_json = JSON.parse(fs.readFileSync('../config.json', 'utf8'))
let token = config_json.token

let client = new Discord.Client()
client.login(token)
let discordHeper = new DiscordHeper(token, client)


function qwe() {
    console.log(`Logged in as ${client.user.tag}`)
    console.log()
    //discordHeper.GetAllUrl()
    //discordHeper.SortGuilds()
    //discordHeper.LogUsersGuilds()
}

client.on('ready', qwe)


//sqlite.close()

/*
client.on('voiceStateUpdate', (oldMember, newMember) => {
        let newUserChannel = newMember.voiceChannel
        let oldUserChannel = oldMember.voiceChannel

        if (oldUserChannel === undefined && newUserChannel !== undefined) {
            // User Joins a voice channel

            console.log('User Join')
            console.log('Guild: ' + newUserChannel.guild.name + '  ID: ' + newUserChannel.guild.id)
            console.log('Канал: ' + newUserChannel.name + '  ID: ' + newUserChannel.id)
            console.log('Ник: ' + newMember.user.username + ' ID:' + newMember.user.id)
            console.log('Время: ' + new Date())
            console.log()

            let param = {
                'guild_id': newUserChannel.guild.id,
                'guild_name': newUserChannel.guild.name,
                'channel_id': newUserChannel.id,
                'channel_name': newUserChannel.name,
                'user_id': newMember.user.id,
                'user_name': newMember.user.username,
                'date_time': new Date().toString(),
                'status': 'Join'
            }
            DataBase.Insert_friends_logs(param)

        } else if (newUserChannel === undefined) {
            // User Leave a voice channel

            console.log('User Leave')
            console.log('Guild: ' + oldUserChannel.guild.name + '  ID: ' + oldUserChannel.guild.id)
            console.log('Канал: ' + oldUserChannel.name + '  ID: ' + oldUserChannel.id)
            console.log('Ник: ' + oldMember.user.username + ' ID:' + oldMember.user.id)
            console.log('Время: ' + new Date())
            console.log()

            let param = {
                'guild_id': oldUserChannel.guild.id,
                'guild_name': oldUserChannel.guild.name,
                'channel_id': oldUserChannel.id,
                'channel_name': oldUserChannel.name,
                'user_id': oldMember.user.id,
                'user_name': oldMember.user.username,
                'date_time': new Date().toString(),
                'status': 'Leave'
            }
            DataBase.Insert_friends_logs(param)

        }
    }
)
*/

/*
const path = require('path')
const express = require('express')
const exphbs = require('express-handlebars')

const app = express()
const port = 3000

app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    extname: '.hbs',
    layoutsDir: path.join(__dirname, 'html/layouts')
}))

app.set('view engine', '.hbs')
app.set('views', path.join(__dirname, 'html'))
app.disable('view cache')

app.listen(port, (err) => {
    if (err)
        return console.log('something bad happened', err)
    console.log(`server is listening on ${port}`)
})

app.get('/findfriends', (request, response) => {
    let guilds = discordHeper.FindFriends()
    response.render('index', {guilds: guilds})
})

app.get('/qwe', (request, response) => {
    discordHeper.test()
    const sleep = require('system-sleep')
    while (discordHeper.calculating_members)
        sleep(1000)
    console.log('Done')

    let guilds = 12312321

    response.render('qwe', {
        guilds: guilds
    })

})
*/
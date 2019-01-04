let discord_controllers = new (require('./controllers/discord_controllers'))

let discord_heper = new (require('./components/discord_heper'))(discord_controllers.client)

discord_controllers.set_helper(discord_heper)
discord_controllers.login()

let http_controllers = new (require('./controllers/http_controllers'))(discord_heper)


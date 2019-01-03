let discord_controllers = require('./controllers/discord_controllers')
discord_controllers = new discord_controllers()

let discord_heper = require('./components/discord_heper')
discord_heper = new discord_heper(discord_controllers.client)

let http_controllers = require('./controllers/http_controllers')
http_controllers = new http_controllers(discord_heper)



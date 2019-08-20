class Global {
    constructor() {
        this.api_helper = require('./components/api_helper');
        this.discord_api = require('./components/discord_api');
        this.discord_heper = require('./components/discord_heper');
        this.discord_controllers = require('./controllers/discord_controllers');
        this.http_controllers = require('./controllers/http_controllers');
    }
}

module.exports = new Global();
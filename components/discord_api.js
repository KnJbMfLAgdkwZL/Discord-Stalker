const request = require('sync-request')

class discord_api {
    constructor(token) {
        this.token = token
    }

    SendMessage(channel_id, message) {
        let baseURL = 'https://discordapp.com/api/v6/channels/' + channel_id + '/messages'
        let headers = {
            'Authorization': this.token,
            'Content-Type': 'application/json'
        }
        let data = {
            'content': message
        }
        let response = request('POST', baseURL, {headers: headers, json: data})
        return JSON.parse(response.body)
    }

    GetCurrentUserGuilds() {
        let baseURL = 'https://discordapp.com/api/v6/users/@me/guilds'
        let headers = {
            'Authorization': this.token
        }
        let response = request('GET', baseURL, {headers: headers})
        return JSON.parse(response.body)
    }

    GetChannel(channel_id) {
        let baseURL = 'https://discordapp.com/api/v6/channels/' + channel_id
        let headers = {
            'Authorization': this.token
        }
        let response = request('GET', baseURL, {headers: headers})
        return JSON.parse(response.body)
    }

    GetGuild(guild_id) {
        let baseURL = 'https://discordapp.com/api/v6/guilds/' + guild_id
        let headers = {
            'Authorization': this.token
        }
        let response = request('GET', baseURL, {headers: headers})
        return JSON.parse(response.body)
    }

    GetGuildChannels(guild_id) {
        let baseURL = 'https://discordapp.com/api/v6/guilds/' + guild_id + '/channels'
        let headers = {
            'Authorization': this.token
        }
        let response = request('GET', baseURL, {headers: headers})
        return JSON.parse(response.body)
    }

    GetUser(user_id) {
        let baseURL = 'https://discordapp.com/api/v6/users/' + user_id
        let headers = {
            'Authorization': this.token
        }
        let response = request('GET', baseURL, {headers: headers})
        return JSON.parse(response.body)
    }

    GetGuildMember(guild_id, user_id) {
        let baseURL = 'https://discordapp.com/api/v6/guilds/' + guild_id + '/members/' + user_id
        let headers = {
            'Authorization': this.token
        }
        let response = request('GET', baseURL, {headers: headers})
        return JSON.parse(response.body)
    }

    GetGuildVoiceRegions(guild_id) {
        let baseURL = 'https://discordapp.com/api/v6/guilds/' + guild_id + '/regions'
        let headers = {
            'Authorization': this.token
        }
        let response = request('GET', baseURL, {headers: headers})
        return JSON.parse(response.body)
    }

    Search(guild_id, content) {
        let baseURL = 'https://discordapp.com/api/v6/guilds/' + guild_id + '/messages/search?content=' + content + '&include_nsfw=true'
        let headers = {
            'Authorization': this.token
        }
        let response = request('GET', baseURL, {headers: headers})
        return JSON.parse(response.body)
    }

    CheckInvite(invite) {
        let baseURL = 'https://discordapp.com/api/v6/invite/' + invite + '?with_counts=true'
        let headers = {
            'Authorization': this.token
        }
        let response = request('GET', baseURL, {headers: headers})
        return JSON.parse(response.body)
    }

    AcceptInvite(invite) {
        let baseURL = 'https://discordapp.com/api/v6/invite/' + invite
        let headers = {
            'Authorization': this.token
        }
        let response = request('POST', baseURL, {headers: headers})
        return JSON.parse(response.body)
    }

    ListGuildMembers(guild_id) {
        let baseURL = 'https://discordapp.com/api/v6/guilds/' + guild_id + '/members?limit=1000'
        let headers = {
            'Authorization': this.token,
        }
        let response = request('GET', baseURL, {headers: headers})
        return JSON.parse(response.body)
    }

    SortGuilds(guild_positions) {
        let baseURL = 'https://discordapp.com/api/v6/users/@me/settings'
        let headers = {
            'Authorization': this.token
        }
        let data = {
            'guild_positions': guild_positions
        }
        let response = request('PATCH', baseURL, {headers: headers, json: data})
        return JSON.parse(response.body)
    }

}

module.exports = discord_api
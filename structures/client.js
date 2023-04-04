const { Client } = require("discord.js");
const { readdirSync } = require('node:fs')
const { load } = require('nsfwjs')

class Bot extends Client {
    constructor() {
        super({
            intents: [
                "Guilds",
                "GuildMessages",
                "MessageContent",
            ]
        })

        this.colors = require('../config.json').colors
        this.limits = require('../config.json').limits
        this.model = load()
    }

    async init(token) {
        if (!token) return console.error("Bot token is empty! Make sure to fill this out in config.js");

        readdirSync('./events').map(async file => {
            let event = require(`../events/${file}`);
            this.on(file.split(".")[0], event.bind(null, this));
        })

        this.login(token);
    }
}

module.exports = Bot;
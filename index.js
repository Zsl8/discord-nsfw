const Client = require('./structures/client')
const client = new Client()
const { client_token } = require('./config.json')

client.init(client_token)
const env = require("dotenv")
env.config()

const db = require("./config/db")
db.connect()

const app = require('./app')

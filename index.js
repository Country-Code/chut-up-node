const env = require("dotenv")
const cors = require("cors")
env.config()

const db = require("./config/db")
db.connect()

const app = require('./app')
app.use(cors({
    origin: '*',
}))

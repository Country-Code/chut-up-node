const env = require("dotenv")
env.config()


const {logger} = require("./utils/tools")
const db = require("./config/db")
db.connect()

const app = require('./app')
let port = process.env.PORT || 5000;

module.exports = app.listen(port, () => {
    logger.log().log(`Server is running and listing on port : ${port}.`, "Server starting")
});
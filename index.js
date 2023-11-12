const express = require('express')
const env = require("dotenv")
const db = require("./config/db")
const userRouter = require("./router/UserRouter")
const chatRouter = require("./router/ChatRouter")
const testRouter = require("./router/TestRouter")
const tools = require("./utils/tools")

env.config()
const APP_ENV = process.env.APP_ENV

db.connect()

const app = express()
app.use(express.json());

app.all("*", (req, res, next) => {
    tools.logReq(req)
    next()
})

app.use("/api/users", userRouter);
app.use("/api/chats", chatRouter);
app.use("/api/tests", testRouter);

// const listEndpoints = require('express-list-endpoints')
// console.log(listEndpoints(app));

app.listen(process.env.PORT || 5000)

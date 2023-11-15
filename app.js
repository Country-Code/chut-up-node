const userRouter = require("./router/UserRouter")
const chatRouter = require("./router/ChatRouter")
const testRouter = require("./router/TestRouter")
const tools = require("./utils/tools")

const express = require('express')
const app = express()
app.use(express.json());

app.all("*", (req, res, next) => {
    tools.logReq(req)
    next()
})

app.use("/api/users", userRouter);
app.use("/api/chats", chatRouter);
app.use("/api/tests", testRouter);

app.listen(process.env.PORT || 5000)

module.exports = app
const userRouter = require("./router/UserRouter")
const chatRouter = require("./router/ChatRouter")
const authRouter = require("./router/AuthRouter")
const testRouter = require("./router/TestRouter")
const tools = require("./utils/tools")
const { errorHandler, notFoundHandler } = require("./middlewares/errorMiddleware")

const express = require('express')
const cors = require('cors');

const app = express();
app.use(cors({origin: "*"}));
app.use(express.json());

app.all("*", (req, res, next) => {
    tools.logReq(req)
    next()
})

app.use("/api/users", userRouter);
app.use("/api/chats", chatRouter);
app.use("/api/tests", testRouter);
app.use("/api/auth", authRouter);

app.use(notFoundHandler, errorHandler);

module.exports = app
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

app.use("/api/auth", require("./router/authRouter"));
app.use("/test", require("./router/testRouter"));
app.use("/api", require("./router/apiRouter"));

app.use(notFoundHandler, errorHandler);

// const listEndpoints = require('express-list-endpoints');
// console.log(listEndpoints(app));

module.exports = app
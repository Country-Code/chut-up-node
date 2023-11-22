const {logger} = require('../utils/tools');

const getFirstFileFromStack = (stack) => {
    const indicator = "  at ";
    const firstIndex = stack.indexOf(indicator);
    const secondIndex = stack.indexOf("\n", firstIndex + 1);

    return stack.substring(firstIndex + indicator.length, secondIndex);
}

const prepareAndLogError = (err) => {
    let message = "";
    message += `Error Message   : "${err.message}"\n`;
    message += `Error location  : "${getFirstFileFromStack(err.stack)}"\n`;
    // message += `Error stack     : \n${err.stack}\n`;
    logger.error().log(message, "Internal Server Error")
}

const notFoundHandler = (req, res) => {
    res.status(404)
    throw new Error(`Not Found - ${req.originalUrl}`);
}

const errorHandler = (err, req, res, next) => {
    prepareAndLogError(err);

    let message = "An unexpected Internal Server Error occurred. Please check the server logs for more detailed information.";
    let status = 500;

    if (res.statusCode) {
        message =  err.message;
        status = res.statusCode;
    }

    res.status(status).json({message, status: "KO"});
}


module.exports = { errorHandler, notFoundHandler }

const LOG_LENGTH = 150;
const date = require('./date');

const Log = {
    type: "log",
    logTitle: function (title) {
        let currentDate = date.current();
        let starsLen = LOG_LENGTH - 6 - title.length - currentDate.length;
        console[this.type](`${currentDate} === ${title} ${"*".repeat(starsLen)}`);
    },
    logLine: function () {
        console[this.type](`${"#".repeat(LOG_LENGTH)}`);
    },
    logMessage: function (message) {
        console[this.type](`${"=".repeat(50)} Body   :`);
        console[this.type](message);
    },
    log: function (message, title = null) {
        let loggedTitle = title ?? this.type.toUpperCase()
        this.logLine();
        this.logTitle(loggedTitle);
        this.logMessage(message);
        this.logLine();
    }
}


const logger = {
    log: () => {
        return Object.create(Log);
    },
    debug: () => {
        let debugLog = Object.create(Log);
        debugLog.type = "debug";
        return debugLog
    },
    info: () => {
        let infoLog = Object.create(Log);
        infoLog.type = "info";
        return infoLog
    },
    error: () => {
        let errorLog = Object.create(Log);
        errorLog.type = "log";
        return errorLog
    },
}

module.exports = logger;

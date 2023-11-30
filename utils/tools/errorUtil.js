const string = require("./string");

const error = {
    generateError: (config = {}, options = {}) => {
        let message = config?.message ?? "";
        message = string.replaceVariables(message, options);
        let code = config?.code ?? "UNEXPECTED_INTERNAL_SERVER_ERROR"
        let status = config?.status ?? 500;
        const err = new Error();
        err.code = code;
        err.status = status;
        err.message = message;
        return err;
    }
};

module.exports = error;
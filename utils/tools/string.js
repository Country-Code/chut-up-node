const string = {
    replaceVariables: (message, options = {}) => {
        const variableRegex = /\{(\w+)\}/g;

        const replacedMessage = message.replace(
            variableRegex,
            (match, variableName) => {
                return options[variableName] ?? "'#N/A'";
            }
        );

        return replacedMessage;
    },
};

module.exports = string;

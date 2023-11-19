const fs = require('fs');

const smfs = {
    fileExists: function (filePath) {
        try {
            fs.accessSync(filePath, fs.constants.F_OK);
            return true;
        } catch (err) {
            console.log(err);
            return false;
        }
    },
    jsFileExists: function (filePath) {
        return this.fileExists(filePath + ".js")
    }
}

module.exports = smfs;

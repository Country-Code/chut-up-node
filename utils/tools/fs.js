const fs = require("fs");
const jsyaml = require("js-yaml");

const smfs = {
    file: {
        exists: function (filePath, ext = ".js") {
            let completFilePath = filePath + ext;
            try {
                fs.accessSync(completFilePath, fs.constants.F_OK);
                return true;
            } catch (err) {
                console.log(err);
                return false;
            }
        },
    },
    read: {
        file: function (filePath) {
            return fs.readFileSync(filePath, "utf8");
        },
        yaml: function (filePath) {
            try {
                const yamlFileContent = fs.readFileSync(filePath, "utf8");

                let data = jsyaml.load(yamlFileContent);
                if (data === undefined) {
                    data = {};
                }
                return data;
            } catch (error) {
                console.log(`Error reading YAML file: ${error.message}`);
                return null;
            }
        },
    },
};

module.exports = smfs;

const fs = require('fs');
const yaml = require('js-yaml');

function yaml(filePath) {
  try {
    const yamlFileContent = fs.readFileSync(filePath, 'utf8');

    const data = yaml.load(yamlFileContent);
    return data;
  } catch (error) {
    console.log(`Error reading YAML file: ${error.message}`);
    return null;
  }
}

module.exports = {
  yaml,
};

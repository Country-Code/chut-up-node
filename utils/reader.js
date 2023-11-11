const fs = require('fs');
const jsyaml = require('js-yaml');

function yaml(filePath) {
  try {
    const yamlFileContent = fs.readFileSync(filePath, 'utf8');

    let data = jsyaml.load(yamlFileContent);
    if (data === undefined) {
      data = {}
    }
    return data;
  } catch (error) {
    console.log(`Error reading YAML file: ${error.message}`);
    return null;
  }
}

module.exports = {
  yaml,
};

const swaggerUi = require('swagger-ui-express');
const fs = require("fs")
const yaml = require('js-yaml')

let swaggerSetup;

try {
    const openApiSpecs = yaml.load(fs.readFileSync('./openapi.yaml', 'utf8'));
    swaggerSetup = swaggerUi.setup(openApiSpecs)
} catch (e) {
    console.error(e);
}

module.exports = swaggerSetup;
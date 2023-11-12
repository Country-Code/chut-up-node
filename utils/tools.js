const path = require('path');

const extractFieldsFromRequestBody = (reqBody, schema) => {
    const allowedFields = Object.keys(schema.paths);
    const extractedFields = {};

    allowedFields.forEach((field) => {
        if (reqBody[field] !== undefined) {
            extractedFields[field] = reqBody[field];
        }
    });

    return extractedFields;
};

function loadModule(module) {
    const moduleContent = require(module);
    return moduleContent
}

function loadModuleMethod(module, method) {
    const modulePath = path.resolve(__dirname, "../", module)
    const methodContent = require(modulePath)[method];
    return methodContent
}

function logReq(req) {
    const APP_ENV = process.env.APP_ENV
    if (APP_ENV !== "production") {
        console.log("*".repeat(30) + "       " + req.method + " - " + req.url)
        console.log(`Env : ${APP_ENV}`)
        console.log(`req.query : `, req.query)
        console.log(`req.params : `, req.params)
        console.log(`req.headers.authorization : `, req.headers.authorization)
    }
}

const getMiddlewaresFromConfig = (entityName) => {
    const reader = require('./reader');
    const path = require('path');
    
    const middlewaresConfigFilePath = path.resolve(__dirname, "../config/middlewares.yaml")
    
    const middlewaresConfig = reader.yaml(middlewaresConfigFilePath)
    let routerMiddlewares = []
    if (middlewaresConfig) routerMiddlewares = middlewaresConfig[entityName] ?? []
    return routerMiddlewares
}

module.exports = { loadModule, loadModuleMethod, extractFieldsFromRequestBody, logReq, getMiddlewaresFromConfig }
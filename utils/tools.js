const path = require('path');
const logger = require("./tools/logger");
const date = require("./tools/date");
const fs = require("./tools/fs");
const errorUtil = require("./tools/errorUtil");

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
    const modulePath = path.resolve(__dirname, "../", module)
    if (fs.file.exists(modulePath)) {
        const moduleContent = require(modulePath);
        return moduleContent
    }
}

function loadModuleMethod(module, method) {
    const moduleContent = loadModule(module)
    if (moduleContent) {
        const methodContent = moduleContent[method] ?? null;
        return methodContent
    }
}

function logReq(req) {
    const APP_ENV = process.env.APP_ENV
    if (APP_ENV !== "production") {
        console.log("#".repeat(150))
        console.log("*".repeat(30) + "       " + req.method + " - " + req.url)
        console.log(`Env : ${APP_ENV}`)
        console.log('req.headers :', req.headers);
        console.log(`req.query : `, req.query)
        console.log(`req.params : `, req.params)
        console.log(`req.headers.authorization : `, req.headers.authorization)
        console.log("*".repeat(150))
        console.log("#".repeat(150))
    }
}

const getMiddlewaresFromConfig = (entityName) => {
    const path = require('path');
    
    const middlewaresConfigFilePath = path.resolve(__dirname, "../config/middlewares.yaml")
    
    const middlewaresConfig = fs.read.yaml(middlewaresConfigFilePath)
    let routerMiddlewares = []
    if (middlewaresConfig) routerMiddlewares = middlewaresConfig[entityName] ?? []
    return routerMiddlewares
}


module.exports = { date, logger, fs, errorUtil, loadModule, loadModuleMethod, extractFieldsFromRequestBody, logReq, getMiddlewaresFromConfig}
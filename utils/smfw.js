const mongoose = require('mongoose');
const express = require('express');
const asyncHandler = require("express-async-handler");
const tools = require('./tools');

function getCRUDController(model) {
  return {
    create: asyncHandler(async (req, res) => {
      const reqBody = req.body;
      const itemData = tools.extractFieldsFromRequestBody(reqBody, model.schema);
      const data = await model.create(itemData);
      res
        .status(201)
        .json({
          data,
          status: "SUCCESS"
        });
    }),

    getAll: asyncHandler(async (req, res) => {
      const data = await model.find();
      res.json({
        data,
        status: "SUCCESS"
      });
    }),

    getById: asyncHandler(async (req, res) => {
      const itemId = req.params.id;

      const data = await model.findById(itemId);
      if (!data) {
        res.status(404);
        throw new Error(`Document with ${itemId} not found!`);
      }
      res.json({
        data,
        status: "SUCCESS"
      });
    }),

    updateById: asyncHandler(async (req, res) => {
      const reqBody = req.body;
      const itemId = req.params.id;
      const itemData = tools.extractFieldsFromRequestBody(reqBody, model.schema);

      const data = await model.findByIdAndUpdate(itemId, itemData, {
        new: true,
      });
      if (!data) {
        res.status(404);
        throw new Error(`Document with ${itemId} not found!`);
      }
      res.json({
        data,
        status: "SUCCESS"
      });
    }),

    deleteById: asyncHandler(async (req, res) => {
      const itemId = req.params.id;

      const deletedDocument = await model.findByIdAndDelete(itemId);
      if (!deletedDocument) {
        res.status(404);
        throw new Error(`Document with ${itemId} not found!`);
      }
      res
        .status(204)
        .json({
          message: 'The ressource has been deleted successfully',
          status: "SUCCESS" 
        });

    })
  };
}

function getCRUDRouter(controller, entityName) {
  const routerMiddlewares = tools.getMiddlewaresFromConfig(entityName)
  const router = express.Router();

  routerMiddlewares.forEach(({ method, path, middlewares }) => {
    const routeMiddlewares = middlewares.map(({ module, middleware }) => {
      let newMiddleware = tools.loadModuleMethod(module, middleware);
      if (!newMiddleware) console.log(`Warning : Routing for "${entityName}" can't add the middleware "${module}->${middleware}" for "${method}.(${path})"!`)
      return newMiddleware;
    }).filter(middleware => middleware !== null);

    router[method.toLowerCase()](path, ...routeMiddlewares);
  });

  // Get all documents
  if (
    controller.hasOwnProperty("getAll") &&
    typeof controller.getAll === "function"
  )
    router.get("/", controller.getAll);

  // Get a document by ID
  if (
    controller.hasOwnProperty("getById") &&
    typeof controller.getById === "function"
  )
    router.get("/:id", controller.getById);

  // Create a new document
  if (
    controller.hasOwnProperty("create") &&
    typeof controller.create === "function"
  )
    router.post("/", controller.create);

  // Update a document by ID
  if (
    controller.hasOwnProperty("updateById") &&
    typeof controller.updateById === "function"
  )
    router.put("/:id", controller.updateById);

  // Delete a document by ID
  if (
    controller.hasOwnProperty("deleteById") &&
    typeof controller.deleteById === "function"
  )
    router.delete("/:id", controller.deleteById);

  return router;
}

module.exports = {getCRUDController, getCRUDRouter}
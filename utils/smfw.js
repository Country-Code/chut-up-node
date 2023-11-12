const mongoose = require('mongoose');
const express = require('express');
const asyncHandler = require("express-async-handler");
const tools = require('./tools');

function getCRUDController(model) {
  return {
    // Create a new document
    create: asyncHandler(async (req, res) => {
      const reqBody = req.body;
      const itemData = tools.extractFieldsFromRequestBody(reqBody, model.schema);
      try {
        const data = await model.create(itemData);
        res.status(201).json({
          data,
        //   jwt: req.jwt,
        });
      } catch (error) {
        console.error(error);
        res.status(500);
        throw error;
      }
    }),

    // Get all documents
    getAll: asyncHandler(async (req, res) => {
      try {
        const data = await model.find();
        res.status(200).json({
          data,
        //   jwt: req.jwt,
        });
      } catch (error) {
        console.error(error);
        res.status(500);
        throw error;
      }
    }),

    // Get a document by ID
    getById: async (req, res) => {
      const itemId = req.params.id;

      try {
        const document = await model.findById(itemId);
        if (!document) {
          return res.status(404).json({ message: "Document not found" });
        }
        res.json(document);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
      }
    },

    // Update a document by ID
    updateById: async (req, res) => {
      const reqBody = req.body;
      const itemId = req.params.id;
      const itemData = tools.extractFieldsFromRequestBody(reqBody, model.schema);

      try {
        const updatedDocument = await model.findByIdAndUpdate(itemId, itemData, {
          new: true,
        });
        if (!updatedDocument) {
          return res.status(404).json({ message: "Document not found" });
        }
        res.json(updatedDocument);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
      }
    },

    // Delete a document by ID
    deleteById: async (req, res) => {
      const itemId = req.params.id;

      try {
        const deletedDocument = await model.findByIdAndDelete(itemId);
        if (!deletedDocument) {
          return res.status(404).json({ message: "Document not found" });
        }
        res.status(204).send();
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
      }
    },
  };
}

function getCRUDRouter(controller) {
  const router = express.Router();

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
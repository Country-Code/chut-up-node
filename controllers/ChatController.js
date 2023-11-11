const smfw = require('../utils/smfw');
const model = require("../models/ChatModel")

module.exports = smfw.getCRUDController(model)
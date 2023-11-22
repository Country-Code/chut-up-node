const smfw = require('../utils/smfw');
const model = require("../models/messagesModel")

module.exports = smfw.getCRUDController(model)
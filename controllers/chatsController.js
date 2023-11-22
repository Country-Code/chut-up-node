const smfw = require('../utils/smfw');
const model = require("../models/chatsModel")

module.exports = smfw.getCRUDController(model)
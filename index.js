const server = require("./server");
const io = require("./websocket/io");

io.start(server);

const io = require("socket.io");

const start = (server) => {
    io(
        server,
        {
            pingTimeout: 60000,
            cors: {
                origin: "*",
                // credentials: true,
            },
        }
    );

    io.on(
        "connection",
        (socket) => {
            console.log("Connected to socket.io");
            socket.on("setup", (userData) => {
                socket.join(userData._id);
                socket.emit("connected");
            });

            socket.on("join chat", (room) => {
                socket.join(room);
                console.log("User Joined Room: " + room);
            });

            socket.on("typing",(room) => {
                socket.in(room).emit("typing");
            });

            socket.on("stop typing", (room) => {
                socket.in(room).emit("stop typing");
            });

            socket.on("new message", (newMessageRecieved) => {
                let chat = newMessageRecieved.chat;

                if (!chat.users) return console.log("chat.users not defined");

                chat.users.forEach((user) => {
                    if (user._id == newMessageRecieved.sender._id) return;

                    socket.in(user._id).emit("message recieved", newMessageRecieved);
                });
            });

            socket.off("setup", () => {
                console.log("USER DISCONNECTED");
                socket.leave(userData._id);
            });
        }
    );
}


module.exports = { start }
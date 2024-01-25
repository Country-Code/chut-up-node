const socketIo = require("socket.io");

const getServerSocket = (server) => {
    return socketIo(server, {
        pingTimeout: 5000,
        cors: {
            origin: "*",
            // credentials: true,
        },
    });
};

const getServerSocketCallback = (server) => {
    return (clientSocket) => {
        console.log("Connected to clientSocket.io.");
        console.log(
            "clientSocket.client.server.sockets.adapter.rooms : ",
            clientSocket.client.server.sockets.adapter.rooms
        );
        // console.log("Object.keys(clientSocket.client.id) : ", Object.keys(clientSocket.client.id));
        console.log("clientSocket.client.id : ", clientSocket.client.id);

        clientSocket.on("init_connection", (user) => {
            console.log("init_connection fired with dataaa : ", user);
            if (user?._id) {
                console.log("init_connection event accepted");
                clientSocket.join(user._id);
                clientSocket.emit("connected");
                console.log(
                    "clientSocket.client.server.sockets.adapter.rooms : ",
                    clientSocket.client.server.sockets.adapter.rooms
                );
            }
        });

        clientSocket.on("new_message", (message) => {
            console.log("new_message fired with data : ", message);
            if (!message) return;
            let chat = message.chat;

            if (!chat.users) return console.log("chat.users not defined");

            chat.users.forEach((user) => {
                if (user == message.sender._id) {
                    clientSocket
                        .to(user)
                        .except(clientSocket.id)
                        .emit("recieve_message", message);
                } else {
                    console.log("new_message send to : ", user);
                    // Get the list of socket IDs in 'room1'
                    const room1Sockets =
                        clientSocket.client.server.sockets.adapter.rooms;
                    const socketIdsInRoom1 = room1Sockets
                        ? Array.from(room1Sockets)
                        : [];

                    console.log("Socket IDs in : ", user, socketIdsInRoom1);

                    clientSocket.to(user).emit("recieve_message", message);
                }
            });
        });

        clientSocket.on("typing", (typingData) => {
            console.log("#".repeat(100));
            console.log("typing fired with typingData : ", typingData);
            if (!typingData?.chat?.users)
                return console.log("!typingData?.chat?.users not valid!");
            else
                console.log(
                    "!typingData?.chat?.users :",
                    typingData?.chat?.users
                );

            if (!typingData?.user)
                return console.log("!typingData?.user not valid!");

            typingData?.chat.users.forEach((user) => {
                if (user._id !== typingData.user._id) {
                    console.log(
                        "is_typing event send to : ",
                        user.email,
                        user._id
                    );
                    // Get the list of socket IDs in 'room1'
                    const room1Sockets =
                        clientSocket.client.server.sockets.adapter.rooms;
                    const socketIdsInRoom1 = room1Sockets
                        ? Array.from(room1Sockets)
                        : [];

                    console.log("Socket IDs in : ", user._id, socketIdsInRoom1);

                    clientSocket.to(user._id).emit("is_typing", {
                        chat: typingData.chat,
                        user: typingData.user,
                        isTyping: typingData.isTyping,
                    });
                }
            });
        });

        clientSocket.off("init_connection", () => {
            console.log("USER DISCONNECTED");
            clientSocket.leave(user._id);
        });
    };
};

const start = (server) => {
    const serverSocket = getServerSocket(server);
    serverSocket.on("connection", getServerSocketCallback(server));
};

module.exports = { start };

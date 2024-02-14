// server.js
const socketIo = require("socket.io");
const messageService = require("../services/message_services");

const rooms = {};
let users = [];

const startSocket = (server) => {
  const io = socketIo(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
    },
  });
  io.on("connection", (socket) => {
    socket.on("joinRoom", ({ room, username, socketID }) => {
      socket.join(room);
      socket.username = username;
      socket.room = room;

      if (!rooms[room]) {
        rooms[room] = [];
      }
      rooms[room].push(socket);

      const filterUser = users.filter((e) => e.username !== username);
      users = [...filterUser, { room, username, socketID }];

      socket.broadcast
        .to(room)
        .emit("notification", `${username} joined the room.`);
      socket.emit("history-message", messageService.getMessages());
    });

    socket.on("sendMessage", ({ room, message, recipient }) => {
      const currentTime = new Date().getTime();
      const newMessage = {
        sender: socket.username,
        text: message,
        time: currentTime,
      };

      if (recipient) {
        const filterUser = users.find((e) => e.username === recipient);

        socket.broadcast

          .to(filterUser?.socketID)
          .emit("privateMessage", newMessage);
      } else {
        io.to(room).emit("message", newMessage);
      }
    });

    socket.on("typing", () => {
      socket.broadcast.to(socket.room).emit("typing", socket.username);
    });

    socket.on("notTyping", () => {
      socket.broadcast.to(socket.room).emit("notTyping", socket.username);
    });

    socket.on("disconnect", () => {
      console.log(`${socket.username || 'Unknown user'} disconnected`);
      if (socket.room && rooms[socket.room]) {
        const index = rooms[socket.room].indexOf(socket);
        if (index !== -1) {
          rooms[socket.room].splice(index, 1);

          socket.broadcast
            .to(socket.room)
            .emit("notification", `${socket.username} left the room.`);
        }
      }
    });
  });
};

module.exports = startSocket;

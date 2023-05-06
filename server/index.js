const express = require("express");
const { Server } = require("socket.io");
const app = express();
const http = require("http");
const httpServer = http.createServer(app);
const cors = require("cors");
const { addUser, removeUser, getUser, getUsersInRoom } = require("./users");

app.use(cors());
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  socket.on("join", ({ name, room }, callback) => {
    const { error, user } = addUser({ id: socket.id, name, room });
    console.log(name, room);

    if (error) {
      return callback(error);
    }
    socket.emit("message", {
      user: "admin",
      text: `${user.name},Welcome to the room ${user.room}`,
    });
    socket.broadcast.to(user.room).emit("message", {
      user: "admin",
      text: `${user.name} has joined the ${user.room} Room.`,
    });

    socket.join(user.room);
  });

  socket.on("sendMessage", (message, callback) => {
    const user = getUser(socket.id);
    console.log(user);

    io.to(user.room).emit("message", { user: user.name, text: message });
  });
  socket.on("disconnect", () => {
    // console.log("user Disconnected the room");
  });
});

httpServer.listen(5700, () => {
  console.log(`Your server is running on 5700`);
});

const express = require("express");
const socketio = require("socket.io");
const cors = require("cors");
const http = require("http");

const router = require("./router");
const {
  AddUser,
  RemoveUser,
  GetUser,
  GetAllUsersInRoom
} = require('./users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 5000;

server.listen(port, () => {
  console.log(`Server has started on PORT ${port}`);
})

app.use(router);
app.use(cors());

io.on('connection', (socket) => {
  console.log("new connection...");

  socket.on('join', ({
    name,
    room
  }, callback) => {
    const {
      error,
      user
    } = AddUser({
      id: socket.id,
      name,
      room
    });

    if (error) return callback(error);

    socket.emit('message', {
      user: 'admin',
      text: `${user.name}, welcome to the room ${user.room}`
    });
    socket.broadcast.to(user.room).emit('message', {
      user: 'admin',
      text: `${user.name} has joined`
    })
    socket.join(user.room);

    io.to(user.room).emit('room_data', {
      room: user.room,
      users: GetAllUsersInRoom(user.room)
    });

    callback();
  })

  socket.on('send_message', (message, callback) => {
    const user = GetUser(socket.id);

    io.to(user.room).emit('message', {
      user: user.name,
      text: message
    });

    io.to(user.room).emit('room_data', {
      room: user.room,
      users: GetAllUsersInRoom(user.room)
    });


    callback();
  })

  socket.on('disconnect', () => {
    const user = RemoveUser(socket.id);

    if (user)
      io.to(user.room).emit('message', {
        user: 'admin',
        text: `${user.name} has left`
      })
  })
})
// https://www.npmjs.com/package/socket.io
// https://developer.mozilla.org/en-US/docs/Web/API/Geolocation/Using_geolocation

const path = require('path');
const http = require('http');
const publicPath = path.join(__dirname, '../public');
const express = require('express');
const socketIO = require('socket.io');
const {generateMessage, generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');
const {Users} = require('./utils/users');

const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);
var users = new Users();

app.use(express.static(publicPath));

// Note: io.emit send message to all connection
// socket.emit send message to one connection

io.on('connection', (socket) => {
  console.log('New user connected');

  // Listener for join
  socket.on('join', function (params, callback) {
    if (!isRealString(params.name) || !isRealString(params.room)) {
      return callback('Name and room name are required.');
    }

    // Emit to all users connected: io.emit()
    // Emit to everyone except user: socket.to('some place').emit()
    // Broadcast (send to every connection excluding the current connection):
    // socket.broadcast.emit()
    // To specific room: socket.broadcast.to('some place').emit()
    // Exit room: socket.leave('room')

    const welcomeMsg = 'Welcome to chat app!';
    const NewUserMsg = `${params.name} has joined.`;

    socket.join(params.room);
    users.removeUser(socket.id); // Remove user if he / she was in another room.
    users.addUser(socket.id, params.name, params.room);

    io.to(params.room).emit('updateUserList', users.getUserList(params.room));

    socket.emit('newMessage', generateMessage('Admin', welcomeMsg));
    socket.broadcast.to(params.room)
    .emit('newMessage', generateMessage('Admin', NewUserMsg));

    callback();
  });

  socket.on('createMessage', function(message, callback) {
    var user = users.getUser(socket.id);

    if (user && isRealString(message.text)) {
      var userRoom = user.room;
      io.to(userRoom).emit('newMessage', generateMessage(user.name, message.text));
    }

    callback();

  });

  socket.on('createLocationMessage', function (coords) {
    var user = users.getUser(socket.id);

    if (user) {
      var userRoom = user.room;
      io.to(userRoom).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude));
    }
    
  });

  socket.on('disconnect', () => {
    var user = users.removeUser(socket.id);

    if (user) {
      var room = user.room;
      io.to(room).emit('updateUserList', users.getUserList(room));
      io.to(room).emit('newMessage', generateMessage('Admin', `${user.name} left the room.`));
    }

  })
});

server.listen(port, () => {
  console.log(`Chat app listening on port ${port}!`);
})

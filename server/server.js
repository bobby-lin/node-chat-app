// https://www.npmjs.com/package/socket.io
// https://developer.mozilla.org/en-US/docs/Web/API/Geolocation/Using_geolocation

const path = require('path');
const http = require('http');
const publicPath = path.join(__dirname, '../public');
const express = require('express');
const socketIO = require('socket.io');
const {generateMessage, generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');

const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

// Note: io.emit send message to all connection
// socket.emit send message to one connection

io.on('connection', (socket) => {
  console.log('New user connected');

  // Listener for join
  socket.on('join', function (params, callback) {
    if (!isRealString(params.name) || !isRealString(params.room)) {
      callback('Name and room name are required.');
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

    socket.emit('newMessage', generateMessage('Admin', welcomeMsg));
    //
    socket.broadcast.to(params.room)
    .emit('newMessage', generateMessage('Admin', NewUserMsg));

    callback();
  });

  socket.on('createMessage', function(message, callback) {
    console.log('Server received message', message);
    // Send the message to other connected users
    // Acknowledge that the message is received
    io.emit('newMessage', generateMessage(message.from, message.text));
    callback();
  });

  socket.on('createLocationMessage', function (coords) {
    io.emit('newLocationMessage', generateLocationMessage('Admin', coords.latitude, coords.longitude));
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  })
});

server.listen(port, () => {
  console.log(`Chat app listening on port ${port}!`);
})

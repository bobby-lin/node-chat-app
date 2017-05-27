// https://www.npmjs.com/package/socket.io

const path = require('path');
const http = require('http');
const publicPath = path.join(__dirname, '../public');
const express = require('express');
const socketIO = require('socket.io');
const {generateMessage} = require('./utils/message');

const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

// Note: io.emit send message to all connection
// socket.emit send message to one connection

io.on('connection', (socket) => {
  console.log('New user connected');
  const welcomeMsg = 'Welcome to chat app!';
  const NewUserMsg = 'New user has joined.';

  socket.emit('newMessage', generateMessage('Admin', welcomeMsg));

  // broadcast (send to every connection excluding the current connection)
  socket.broadcast.emit('newMessage', generateMessage('Admin', NewUserMsg));

  socket.on('createMessage', function(message) {
    console.log('Server received message', message);
    // Send the message to other connected users
    io.emit('newMessage', generateMessage(message.from, message.text));
  })

  socket.on('disconnect', () => {
    console.log('User disconnected');
  })
});

server.listen(port, () => {
  console.log(`Chat app listening on port ${port}!`);
})

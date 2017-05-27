// https://www.npmjs.com/package/socket.io

const path = require('path');
const http = require('http');
const publicPath = path.join(__dirname, '../public');
const express = require('express');
const socketIO = require('socket.io');

const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket) => {
  console.log('New user connected');

  socket.emit('newMessage', {
    from: 'socrates@gmail.com',
    text: 'Hello. How are you?',
    createdAt: 1234
  });

  socket.on('createMessage', function(message) {
    console.log('Server received message', message);
  })

  socket.on('disconnect', () => {
    console.log('User disconnected');
  })
});

server.listen(port, () => {
  console.log(`Chat app listening on port ${port}!`);
})

var socket = io();
// name of events must be correct {connect, disconnect}
socket.on('connect', function () {
  console.log('Connected to server');

  socket.emit('createMessage', {
    from: 'plato@gmail.com',
    text: 'Hello. I am good.'
  });
  
});

socket.on('disconnect', function () {
  console.log('Disconnected from server');
})

socket.on('newMessage', function(message) {
  console.log('New message:', message);
});

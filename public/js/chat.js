var socket = io();

function scrollToBottom () {
  // Selectors
  var messages = jQuery('#messages');
  var newMessage = messages.children('li: last-child');

  // Heights
  var clientHeight = messages.prop('clientHeight');
  var scrollTop = messages.prop('scrollTop');
  var scrollHeight = messages.prop('scrollHeight');
  var newMessageHeight = newMessage.innerHeight();
  var prevMessageHeight = newMessage.prev().innerHeight();

  var measuredHeight = clientHeight + scrollTop + newMessageHeight + prevMessageHeight
  if (measuredHeight > scrollHeight) {
    messages.scrollTop(scrollHeight);
  }
};

// name of events must be correct {connect, disconnect}
socket.on('connect', function () {
  var params = jQuery.deparam(window.location.search);

  socket.emit('join', params, function (err) {
    if (err) {
      alert(err);
      window.location.href ='/';
    } else {
      console.log('No error');
    }
  });

});

socket.on('disconnect', function () {
  console.log('Disconnected from server');
});

socket.on('updateUserList', function (users) {

  console.log(users);

  var ol = jQuery("<ol></ol>");

  users.forEach((user) => {
    ol.append(jQuery("<li></li>").text(user));
  })

  jQuery('#users').html(ol);
});

socket.on('newMessage', function (message) {
  var template = jQuery("#message-template").html();
  var formattedTime = moment(message.createdAt).format("h:mm a");
  var html = Mustache.render(template, {
    text: message.text,
    from: message.from,
    createdAt: formattedTime
  })

  jQuery('#messages').append(html);
});

socket.on('newLocationMessage', function (message) {
  var template = jQuery("#location-message-template").html();
  var formattedTime = moment(message.createdAt).format("h:mm a");
  var html = Mustache.render(template, {
    url: message.url,
    from: message.from,
    createdAt: formattedTime
  });

  jQuery('#messages').append(html);
});

jQuery('#message-form').on('submit', function (e) {
  e.preventDefault();

  var messageTextbox = jQuery('[name=message]');
  socket.emit('createMessage', {
    text: messageTextbox.val()
  }, function() {
    messageTextbox.val('');
  });
});

var locationButton = jQuery('#send-location');
locationButton.on('click', function () {
  if (!navigator.geolocation) {
    return alert('Geolocation is not supported by your browser');
  }

  locationButton.attr('disabled', 'disabled').text('Sending location...');

  navigator.geolocation.getCurrentPosition(function (position) {
    console.log('Geolocation', position);
    locationButton.removeAttr('disabled').text('Send location');
    socket.emit('createLocationMessage', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    });
  }, function () {
    locationButton.removeAttr('disabled').text('Send location');
    alert('Unable to fetch geolocation');
  });
});

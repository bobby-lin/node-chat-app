var expect = require('expect');
var {generateMessage, generateLocationMessage} = require('./message');

// We use done only if we are testing asynchronous function
describe('generateMessage', () => {
  it('should generate correct message object', () => {
    var from = "tester";
    var text = "text used for testing";
    var message = generateMessage(from, text);

    expect(message).toInclude({from, text});
    expect(message.createdAt).toBeA('number');
  });
});

describe('generateLocationMessage', () => {
  it('should generate correct message object', () => {
    var from = "tester";
    var latitude = 1.2;
    var longitude = 103.82;
    var url = `https://www.google.com/maps?q=${latitude},${longitude}`;
    var message = generateLocationMessage(from, latitude, longitude);

    expect(message).toInclude({from, url});
    expect(message.createdAt).toBeA('number');
  });

})

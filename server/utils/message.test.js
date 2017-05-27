var expect = require('expect');
var {generateMessage} = require('./message');

// We use done only if we are testing asynchronous function
describe('generateMessage', () => {
  it('should generate correct message object', () => {
    var from = "tester";
    var text = "text used for testing";
    var message = generateMessage(from, text);
    expect(message).toInclude({
      from,
      text
    });
    expect(message.createdAt).toBeA('number');
  });
});

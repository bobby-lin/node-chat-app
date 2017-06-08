var expect = require('expect');
var {isRealString} = require('./validation');

// We use done only if we are testing asynchronous function
describe('isRealString', () => {
  it('should reject non-string value', () => {
    var result = isRealString(12);
    expect(result).toBe(false);
  });

  it('should reject string with only spaces', () => {
    var result = isRealString("            ");
    expect(result).toBe(false);
  });

  it('should allow string with non-space character', () => {
    var result = isRealString(" Lol           ");
    expect(result).toBe(true);
  });

});

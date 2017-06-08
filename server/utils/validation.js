var isRealString = (str) => {
  if (typeof str === 'string') {
    return str.trim().length > 0
  }

  return false;
};

module.exports = {isRealString};

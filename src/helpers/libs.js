const helpers = {};

helpers.randomText = function () {
  const possibleChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let randomString = 0;
  for (let i = 0; i < 6; i++) {
    randomString += possibleChars.charAt(
      Math.floor(Math.random() * possibleChars.length)
    );
  }
  return randomString;
};

module.exports = helpers;

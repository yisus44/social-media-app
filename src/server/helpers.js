const helpers = {};
const moment = require("moment");
helpers.timeAgo = function (timestamp) {
  return moment(timestamp).startOf("minute").fromNow();
};

module.exports = helpers;

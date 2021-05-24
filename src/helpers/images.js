const Image = require("../models/Image");

require("../models/Image");

module.exports = {
  async popular() {
    const images = await Image.find().limit(10).sort({ likes: -1 });
    return images;
  },
};

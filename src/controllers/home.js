const { Image } = require("../models/index");
const ctrl = {};

ctrl.index = async function (req, res) {
  const images = await Image.find().sort({ timestamp: -1 });
  console.log(images);
  res.render("index", { images });
};

module.exports = ctrl;
const { Image } = require("../models/index");
const ctrl = {};

const sidebar = require("../helpers/sidebar");

ctrl.index = async function (req, res) {
  const images = await Image.find({})
    .sort({ timestamp: -1 })
    .lean({ virtuals: true });
  let viewModel = { images: [] };
  viewModel.images = images;
  viewModel = await sidebar(viewModel);
  res.render("index", { viewModel });
};

module.exports = ctrl;

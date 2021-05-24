const Stats = require("./stats");
const Images = require("./images");
const Comments = require("./comments");

module.exports = async function (viewModel) {
  const results = await Promise.all([
    Stats(),
    Images.popular(),
    Comments.newest(),
  ]);

  viewModel.sidebar = {
    stats: results[0],
    images: results[1],
    comments: results[2],
  };

  return viewModel;
};

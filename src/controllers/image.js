const path = require("path");
const ctrl = {};
const { randomText } = require("../helpers/libs");
const fs = require("fs-extra");
const sidebar = require("../helpers/sidebar");
const md5 = require("md5");

const { Image, Comment } = require("../models/index");

ctrl.index = async function (req, res) {
  const image = await Image.findOne({
    filename: { $regex: req.params.image_id },
  }).lean({ virtuals: true });

  let viewModel = { image: {}, comments: {} };
  //We converted the mongoose doc into a js object
  //so we dont have the save capacibilty to make views works
  //I know its O(n*m) so it will need somo refactoring...someday
  const image2 = await Image.findOne({
    filename: { $regex: req.params.image_id },
  });
  if (image) {
    image2.views++;
    await image2.save();
    viewModel.image = image;
    const comments = await Comment.find({ image_id: image._id }).lean({
      virtuals: true,
    });

    viewModel.comments = comments;
    viewModel = await sidebar(viewModel);
    console.log(viewModel);
    res.render("image", viewModel);
  } else {
    res.redirect("/");
  }
};

ctrl.create = function (req, res) {
  const saveImage = async () => {
    let imageUrl = randomText();
    const images = await Image.find({ filename: imageUrl });
    if (images.length > 0) {
      saveImage();
    }
    const imageTempPath = req.file.path;
    const ext = path.extname(req.file.originalname).toLowerCase();
    const targetPath = path.resolve(`src/public/upload/${imageUrl}${ext}`);

    const { title, description } = req.body;
    console.log(ext);
    try {
      if (
        ext === ".png" ||
        ext === ".jpg" ||
        ext === ".jpeg" ||
        ext === "gif"
      ) {
        await fs.rename(imageTempPath, targetPath);
        const newImg = new Image({
          title,
          description,
          filename: imageUrl + ext,
        });
        const imageSaved = await newImg.save();
        res.redirect("/images/" + imageUrl);
      } else {
        await fs.unlink(imageTempPath);
        res.send({ error: "File not supported" }).status(500);
        throw new Error("File not supported");
      }
    } catch (err) {
      console.log(err);
    }
  };
  saveImage();
};

ctrl.comment = async function (req, res) {
  const image = await Image.findOne({
    filename: { $regex: req.params.image_id },
  });
  if (image) {
    const newComment = new Comment(req.body);
    newComment.gravatar = md5(newComment.email);
    newComment.image_id = image._id;
    await newComment.save();
    res.redirect("/images/" + image.uniqueId);
  } else {
    res.redirect("/");
  }

  res.send("comment");
};
ctrl.like = async function (req, res) {
  const image = await Image.findOne({
    filename: { $regex: req.params.image_id },
  });
  if (image) {
    image.likes++;
    await image.save();
    res.json({ likes: image.likes });
  } else {
    res.status(404).json({ error: "Internal error" });
  }
};
ctrl.delete = async function (req, res) {
  const image = await Image.findOne({
    filename: { $regex: req.params.image_id },
  });
  if (image) {
    await fs.unlink(path.resolve("./src/public/upload/" + image.filename));
    await Comment.deleteOne({
      image_id: image._id,
    });
    await image.remove();
    res.json(true);
  }
};

module.exports = ctrl;

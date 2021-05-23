const path = require("path");
const ctrl = {};
const { randomText } = require("../helpers/libs");
const fs = require("fs-extra");

const { Image } = require("../models/index");

ctrl.index = function (req, res) {};

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
        res.send("works");
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

ctrl.like = function (req, res) {};
ctrl.comment = function (req, res) {};
ctrl.delete = function (req, res) {};

module.exports = ctrl;

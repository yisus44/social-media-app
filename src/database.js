const mongoose = require("mongoose");
const { database } = require("./keys");

mongoose.connect(database.URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

console.log("Database connected");

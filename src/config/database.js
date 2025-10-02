const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://amohapatra458_db_user:YnzAgQTUJadgu6XE@cluster0.skou9vv.mongodb.net/devTinder"
  );
};

module.exports = connectDB;

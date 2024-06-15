const mongoose = require("mongoose");

async function main() {
  mongoose.connect("mongodb://127.0.0.1:27017/passport");
}

main()
  .then(() => console.log("connected to db"))
  .catch((err) => console.log("error: ", err.message));

const userSchema = mongoose.Schema({
  username: String,
  password: String,
});

const User = mongoose.model("User", userSchema);

module.exports = User;

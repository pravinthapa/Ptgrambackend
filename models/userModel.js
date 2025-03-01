const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "please  add the username"],
    },
    email: {
      type: String,
      required: [true, "please  add the email"],
      unique: [true, "email taken"],
    },
    password: {
      type: String,
      required: [true, "please  add the password"],
    },
    profile: {
      type: String,
    },
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("User", userSchema);

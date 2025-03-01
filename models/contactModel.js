const mongoose = require("mongoose");
const contactSchema = mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "user",
    },
    name: {
      require: [true, "Please enter the name!!"],
      type: String,
    },
    contact: {
      type: String,
      require: [true, "Please enter the contact"],
    },
    email: {
      type: String,
      require: [true, "Please enter the email"],
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Contact", contactSchema);

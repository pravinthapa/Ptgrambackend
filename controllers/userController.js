const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// register
const register = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  if (!email || !password || !username) {
    res.status(400);
    throw new Error("all fields are required");
  }
  const userAvailable = await User.findOne({ email });
  if (userAvailable) {
    res.status(400);
    throw new Error("user already exist");
  }
  const hashpasword = await bcrypt.hash(password, 10);
  const user = await User.create({
    username,
    email,
    password: hashpasword,
  });
  if (user) {
    res.status(201).json({ id: user.id, name: user.username });
  } else {
    res.status(400);
    throw new Error("User data is not valid");
  }
});
// login
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("all fields are required");
  }
  const user = await User.findOne({ email });

  // compare password with hashed password
  if (user && (await bcrypt.compare(password, user.password))) {
    const accessToken = jwt.sign(
      {
        users: {
          username: user.username,
          email: user.email,
          id: user.id,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "150m" }
    );
    res.status(201).json({ accessToken });
    res.json({ message: "login success" });
  } else {
    res.status(401);
    throw new Error("No such credential found");
  }
  res.json({ message: "login yoh hohoho" });
});
// friends
const friendsAdd = asyncHandler(async (req, res) => {
  const friendId = req.query.id; // friend ID from the query
  const userId = req.user.id; // current logged-in user I

  if (userId === friendId) {
    return res.status(400).json({ error: "You cannot befriend yourself!" });
  }

  // Find the user to be added or removed from the friends list
  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ error: "User not found!" });
  }

  // Check if the current user is already friends with the other user
  const isFriend = user.friends.includes(friendId);

  if (isFriend) {
    // If already friends, unfriend (remove from the friends array)
    user.friends = user.friends.filter((id) => !id.equals(friendId));
  } else {
    // If not friends, add to the friends array
    user.friends.push(friendId);
  }

  // Save the updated user data
  await user.save();

  res.json({
    message: isFriend ? "Friend removed" : "Friend added",
    friends: user.friends.length,
  });
});

// currentuser
const currentUser = asyncHandler(async (req, res) => {
  const myData = await User.findById(req.user.id);
  res.json(myData);
});
// allusers
const allUsers = asyncHandler(async (req, res) => {
  const allData = await User.find();
  res.json(allData);
});

module.exports = {
  register,
  allUsers,
  login,
  currentUser,
  friendsAdd,
};

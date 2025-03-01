const express = require("express");
const {
  register,
  login,
  currentUser,
  allUsers,
  friendsAdd,
} = require("../controllers/userController");
const verifyToken = require("../middleware/tokenHandeler");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/friend", verifyToken, friendsAdd);
router.get("/current", verifyToken, currentUser);
router.get("/all", verifyToken, allUsers);
module.exports = router;

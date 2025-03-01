const express = require("express");
const router = express.Router();
const {
  messagePost,
  messageDelete,
  messageGet,
  messageRecent,
} = require("../controllers/chatController");

router.route("/").post(messagePost).get(messageGet).delete(messageDelete);
router.route("/recent/:id").get(messageRecent);

module.exports = router;

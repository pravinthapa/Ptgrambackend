const express = require("express");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const {
  deletePost,
  likesPost,
  addPost,
  getPost,
  messagePost,
  addVideo,
} = require("../controllers/postController");
const verifyToken = require("../middleware/tokenHandeler");

const router = express.Router();

// Ensure 'uploads/' folder exists before saving files
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure Multer to store files on disk
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Save uploads to "uploads" directory
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Rename file
  },
});

const upload = multer({ storage });

router.use(verifyToken);

// Routes
router
  .route("/post")
  .get(getPost)
  .post(upload.single("file"), addPost)
  .delete(deletePost);
router.route("/post/like").post(likesPost);
router.route("/post/comment").post(messagePost);
module.exports = router;

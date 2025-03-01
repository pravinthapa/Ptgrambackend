const asyncHandler = require("express-async-handler");
const Post = require("../models/postModel");

const addPost = asyncHandler(async (req, res) => {
  if (!req.user || !req.user.id) {
    return res.status(401).json({ error: "Unauthorized! Please log in." });
  }

  const { description } = req.body;

  if (!req.file || !req.file.filename) {
    return res
      .status(400)
      .json({ error: "File upload failed! Please try again." });
  }

  const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${
    req.file.filename
  }`;
  const isVideo = req.file.mimetype.startsWith("video");

  const post = await Post.create({
    photo: isVideo ? null : fileUrl,
    video: isVideo ? fileUrl : null,
    description: description || "", // Default empty string to prevent null values
    user_id: req.user.id,
  });
  res.status(201).json({ message: "Post created successfully", post });
});

const getPost = asyncHandler(async (req, res) => {
  const posts = await Post.find();
  res.json(posts);
});

const deletePost = asyncHandler(async (req, res) => {
  const deleteItem = await Post.findById(req.query.id);

  if (!deleteItem) {
    return res.status(404).json({ error: "Post not found!" });
  }

  await Post.findByIdAndDelete(req.query.id);

  res.status(200).json({ message: "Post deleted successfully" });
});

const likesPost = asyncHandler(async (req, res) => {
  const postId = req.query.id;
  const userId = req.user.id;

  const post = await Post.findById(postId);
  if (!post) {
    return res.status(404).json({ error: "Post not found!" });
  }

  const hasLiked = post.likes.includes(userId);

  if (hasLiked) {
    // If user already liked, remove their like
    post.likes = post.likes.filter((id) => id.toString() !== userId.toString());
  } else {
    // Otherwise, add like
    post.likes.push(userId);
  }

  await post.save();

  res.json({ message: "Like status updated", likes: post.likes.length });
});
const messagePost = asyncHandler(async (req, res) => {
  const postId = req.query.id;
  const { text } = req.body;

  if (!req.user || !req.user.id) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (!text) {
    return res.status(400).json({ message: "This field is required" });
  }

  const findId = await Post.findById(postId);
  if (!findId) {
    return res.status(404).json({ message: "No post found" });
  }

  // Ensure comments exist before pushing
  findId.comments = findId.comments || [];
  findId.comments.push({ text, user_id: req.user.id });

  await findId.save();
  res.status(201).json(findId.comments);
});

module.exports = { addPost, getPost, deletePost, likesPost, messagePost };

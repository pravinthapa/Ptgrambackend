const asyncHandler = require("express-async-handler");
const Chat = require("../models/chatModel");
const messagePost = asyncHandler(async (req, res) => {
  const { sender, receiver, content } = req.body;
  try {
    const message = new Chat({ sender, receiver, content });
    await message.save();
    res.json({ message: "Message sent", data: message });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
const messageGet = asyncHandler(async (req, res) => {
  const { user1, user2 } = req.query;
  try {
    const messages = await Chat.find({
      $or: [
        { sender: user1, receiver: user2 },
        { sender: user2, receiver: user1 },
      ],
    }).sort({ timestamp: 1 });

    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
const messageDelete = asyncHandler(async (req, res) => {
  const { id } = req.query;
  try {
    await Chat.findByIdAndDelete(id);
    res.json({ message: "Message deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
const messageRecent = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  try {
    const recentChats = await Chat.aggregate([
      { $match: { $or: [{ sender: userId }, { receiver: userId }] } },
      { $sort: { timestamp: -1 } },
      {
        $group: {
          _id: {
            $cond: [{ $eq: ["$sender", userId] }, "$receiver", "$sender"],
          },
          lastMessage: { $first: "$$ROOT" },
        },
      },
      { $replaceRoot: { newRoot: "$lastMessage" } },
    ]);

    res.json(recentChats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = { messagePost, messageGet, messageDelete, messageRecent };

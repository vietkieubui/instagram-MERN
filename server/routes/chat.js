const express = require("express");
const router = express.Router();
const verifyToken = require("./../middleware/auth");

//Models
const Conversation = require("../models/Conversation");
const Message = require("../models/Message");
const User = require("../models/User");

const perm = (xs) => {
  let ret = [];

  for (let i = 0; i < xs.length; i = i + 1) {
    let rest = perm(xs.slice(0, i).concat(xs.slice(i + 1)));

    if (!rest.length) {
      ret.push([xs[i]]);
    } else {
      for (let j = 0; j < rest.length; j = j + 1) {
        ret.push([xs[i]].concat(rest[j]));
      }
    }
  }
  return ret;
};

/**
 * @route POST api/chat/conversation
 * @description create conversation
 * @access Private
 */

router.post("/conversation", verifyToken, async (req, res) => {
  const { members } = req.body;

  if (!members || members.length <= 1) {
    return res.json({ success: false, message: "Members required!" });
  }
  if (!members.includes(req.userId)) {
    return res.json({
      success: false,
      message: "Can not create conversation for other people!",
    });
  }

  try {
    const permArray = perm(members);
    const conversationCondition = {
      $or: [...permArray.map((item) => ({ members: item }))],
    };
    const conversation = await Conversation.findOne(conversationCondition);
    if (conversation) {
      return res.json({
        success: true,
        message: "Conversation already!",
        conversation,
      });
    } else {
      const newConversation = new Conversation({
        members,
      });
      await newConversation.save();
      res.json({
        success: true,
        message: "Create Conversation successed!",
        conversation: newConversation,
      });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error!" });
  }
});

/**
 * @route get api/chat/conversation
 * @description get all conversations user is paticipant
 * @access Private
 */

router.get("/conversation", verifyToken, async (req, res) => {
  try {
    const conversationCondition = { members: { $all: [req.userId] } };
    const conversations = await Conversation.find(conversationCondition)
      .populate("members", ["username", "avatar", "name", "bio"])
      .sort({
        lastMessage: -1,
      });
    if (!conversations) {
      return res.status(401).json({
        success: false,
        message: "Conversations not found or User not authorised",
      });
    }
    return res.json({
      success: true,
      message: "SUCCESS!",
      conversations,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error!" });
  }
});

/**
 * @route POST api/chat/message
 * @description create message
 * @access Private
 */

router.post("/message/:id", verifyToken, async (req, res) => {
  const { content } = req.body;
  if (!content) {
    return res.json({ success: false, message: "Content required!" });
  }
  const conversation = await Conversation.findById(req.params.id);
  if (!conversation) {
    return res.status(401).json({
      success: false,
      message: "Conversations not found or User not authorised",
    });
  }
  if (!conversation.members.includes(req.userId)) {
    return res.status(401).json({
      success: false,
      message: "You're not in this conversation!",
    });
  }
  try {
    const newMessage = new Message({
      content,
      conversation: req.params.id,
      user: req.userId,
    });
    await newMessage.save();
    let updatedConversation = { lastMessage: Date.now() };
    const conversationUpdateCondition = { _id: req.params.id };
    updatedConversation = await Conversation.findOneAndUpdate(
      conversationUpdateCondition,
      updatedConversation,
      { new: true }
    );
    res.json({ success: true, message: "Sent!", chatMessage: newMessage });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error!" });
  }
});

/**
 * @route POST api/chat/conversation
 * @description get all messages of conversation
 * @access Private
 */

router.get("/conversation/:id", verifyToken, async (req, res) => {
  try {
    const conversation = await Conversation.findById(req.params.id);
    if (!conversation) {
      return res.status(401).json({
        success: false,
        message: "Conversations not found or User not authorised",
      });
    }
    if (!conversation.members.includes(req.userId)) {
      return res.status(401).json({
        success: false,
        message: "You're not in this conversation!",
      });
    }
    const conversationMessagesCondition = { conversation: conversation._id };
    const conversationMessages = await Message.find(
      conversationMessagesCondition
    ).populate("user", ["username", "avatar", "name", "bio"]);
    if (!conversationMessages) {
      return res.status(401).json({
        success: false,
        message: "Conversation not found or User not authorised",
      });
    }
    return res.json({ success: true, conversationMessages });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error!" });
  }
});

module.exports = router;

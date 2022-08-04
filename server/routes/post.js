const express = require("express");
const router = express.Router();
const verifyToken = require("./../middleware/auth");

//MODELS
const Comment = require("../models/Comment");
const Post = require("./../models/Post");

/**
 * @route POST api/posts
 * @description create post
 * @access Private
 */

router.post("/", verifyToken, async (req, res) => {
  const { caption, picture } = req.body;
  if (!picture)
    return res.json({ success: false, message: "Picture is required" });
  try {
    const newPost = new Post({
      caption,
      picture,
      user: req.userId,
    });
    await newPost.save();
    res.json({ success: true, message: "Posted!", post: newPost });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error!" });
  }
});

/**
 * @route GET api/posts
 * @description GET ALL POST OF USER
 * @access Public
 */

router.get("/:userId", verifyToken, async (req, res) => {
  try {
    const posts = await Post.find({ user: req.params.userId }).populate(
      "user",
      ["username", "avatar", "name", "bio"]
    );
    res.json({ success: true, posts });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error!" });
  }
});

/**
 * @route PUT api/posts/update
 * @description Update post
 * @access Private
 */

router.put("/update/:id", verifyToken, async (req, res) => {
  const { caption, picture } = req.body;
  if (!picture)
    return res.json({ success: false, message: "Picture is required" });
  try {
    let updatedPost = { caption, picture };
    const postUpdateCondition = { _id: req.params.id, user: req.userId };
    updatedPost = await Post.findByIdAndUpdate(
      postUpdateCondition,
      updatedPost,
      { new: true }
    );
    // User not authorised to update post
    if (!updatedPost) {
      return res.status(401).json({
        success: false,
        message: "Post not found or User not authorised",
      });
    }
    res.json({
      success: true,
      message: "Updated!",
      post: updatedPost,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error!" });
  }
});

/**
 * @route DELETE api/posts/update
 * @description Delete post
 * @access Private
 */

router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const deleteCondition = { _id: req.params.id, user: req.userId };
    const deletedPost = await Post.findOneAndDelete(deleteCondition);
    // User not authorised to delete post
    if (!deletedPost) {
      return res.json({
        success: false,
        message: "Post not found or User not authorised",
      });
    }
    return res.json({
      success: true,
      message: "DELETED",
      post: deletedPost,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error!" });
  }
});

/**
 * @route PUT api/posts/like
 * @description Update posts when user like or dislike
 * @access Private
 */
router.put("/like/:id", verifyToken, async (req, res) => {
  try {
    const updatedPostCondition = { _id: req.params.id };
    let updatedPost = await Post.findById(updatedPostCondition);
    let message = "";
    if (updatedPost.likes.includes(req.userId)) {
      updatedPost = {
        ...updatedPost,
        _doc: {
          likes: updatedPost.likes.filter((item) => item !== req.userId),
        },
      };
      message = "Disliked!";
    } else {
      updatedPost = {
        ...updatedPost,
        likes: updatedPost.likes.push(req.userId),
      };
      message = "Liked!";
    }
    updatedPost = await Post.findByIdAndUpdate(
      updatedPostCondition,
      updatedPost,
      {
        new: true,
      }
    );

    // User not authorised to update post
    if (!updatedPost) {
      return res.status(401).json({
        success: false,
        message: "Post not found or User not authorised",
      });
    }
    res.json({
      success: true,
      message: message,
      post: updatedPost,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error!" });
  }
});

/**
 * @route POST api/posts/comment
 * @description Comment Post
 * @access Private
 */

router.post("/comment/:id", verifyToken, async (req, res) => {
  const { content } = req.body;
  if (!content) {
    return res.json({ success: false, message: "Content is required!" });
  }
  try {
    const newComment = new Comment({
      content,
      user: req.userId,
      post: req.params.id,
    });
    // console.log(newComment);
    await newComment.save();
    res.json({ success: true, message: "Commented!", comment: newComment });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error!" });
  }
});

/**
 * @route GET api/posts/comment
 * @description GET ALL COMMENT OF POST
 * @access Private
 */

router.get("/comment/:id", verifyToken, async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.id }).populate(
      "user",
      ["username"]
    );
    res.json({ success: true, comments });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error!" });
  }
});

module.exports = router;

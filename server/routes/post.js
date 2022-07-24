const express = require("express");
const router = express.Router();
const verifyToken = require("./../middleware/auth");

const Post = require("./../models/Post");

/**
 * @route POST api/posts
 * @description create post
 * @access Private
 */

router.post("/", verifyToken, async (req, res) => {
  const { caption, picture } = req.body;
  if (!picture)
    return res
      .status(400)
      .json({ success: false, message: "Picture is required" });
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

router.get("/:userId", async (req, res) => {
  try {
    const posts = await Post.find({ user: req.params.userId }).populate(
      "user",
      ["username"]
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
 * @description Update posts
 * @access Private
 */

router.put("/update/:id", verifyToken, async (req, res) => {
  const { caption, picture } = req.body;
  if (!picture)
    return res
      .status(400)
      .json({ success: false, message: "Picture is required" });
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
 * @route PUT api/posts/like
 * @description Update posts when user like or dislike
 * @access Private
 */
router.put("/like/:id", verifyToken, async (req, res) => {
  try {
    const likeCondition = { _id: req.params.id };
    let updatedPost = await Post.findById(likeCondition);
    let message = "";
    if (updatedPost.like.includes(req.userId)) {
      updatedPost = {
        ...updatedPost,
        _doc: {
          like: updatedPost.like.filter((item) => item !== req.userId),
        },
      };
      message = "Disliked!";
    } else {
      updatedPost = { ...updatedPost, like: updatedPost.like.push(req.userId) };
      message = "Liked!";
    }
    updatedPost = await Post.findByIdAndUpdate(likeCondition, updatedPost, {
      new: true,
    });

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
  } catch (error) {}
});

module.exports = router;

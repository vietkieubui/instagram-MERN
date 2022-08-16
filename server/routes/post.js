const express = require("express");
const router = express.Router();
const verifyToken = require("./../middleware/auth");

//MODELS
const Comment = require("../models/Comment");
const User = require("../models/User");
const Post = require("./../models/Post");
const Follow = require("./../models/Follow");

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
 * @description GET A POST
 * @access Private
 */

router.get("/post/:id", verifyToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate("user", [
      "username",
      "avatar",
      "name",
      "bio",
    ]);
    res.json({ success: true, post });
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
 * @access Private
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
    updatedPost = await Post.findOneAndUpdate(
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
 * @route DELETE api/posts/
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
 * @route GET api/posts/likes
 * @description GET ALL USERS LIKE POST
 * @access Private
 */

router.get("/likes/:id", verifyToken, async (req, res) => {
  try {
    const tmp = await Post.findById(req.params.id).select("likes");
    if (!tmp) {
      return res.json({
        success: false,
        message: "Post not found or User not authorised",
      });
    }
    const likes = tmp.likes;
    if (likes.length === 0) {
      return res.json({
        success: true,
        message: "No one likes this post",
        likes: [],
      });
    }
    const likesCondition = {
      $or: [...likes.map((user) => ({ _id: user }))],
    };
    const users = await User.find(likesCondition).select(
      "-password -createdAt"
    );
    if (!users) {
      return res.json({
        success: false,
        message: "User not authorised",
      });
    }
    return res.json({
      success: true,
      message: "Get success",
      likes: users,
    });
  } catch (error) {}
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
 * @description GET ALL COMMENTS OF POST
 * @access Private
 */

router.get("/comments/:id", verifyToken, async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.id }).populate(
      "user",
      ["username", "avatar", "name", "bio"]
    );
    res.json({ success: true, comments });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error!" });
  }
});

/**
 * @route UPDATE api/posts/comment/update
 * @description UPDATE A comment
 * @access Private
 */

router.put("/comment/update/:id", verifyToken, async (req, res) => {
  const { content } = req.body;
  if (!content)
    return res.json({ success: false, message: "Content is required" });
  try {
    let updatedComment = { content };
    const commentUpdateCondition = { _id: req.params.id, user: req.userId };
    updatedComment = await Comment.findOneAndUpdate(
      commentUpdateCondition,
      updatedComment,
      { new: true }
    );
    // User not authorised to update post
    if (!updatedComment) {
      return res.status(401).json({
        success: false,
        message: "Comment not found or User not authorised",
      });
    }
    res.json({
      success: true,
      message: "Updated!",
      comment: updatedComment,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error!" });
  }
});

/**
 * @route DELETE api/posts/comment
 * @description DELETE A comment
 * @access Private
 */

router.delete("/comment/:id", verifyToken, async (req, res) => {
  try {
    const deleteCondition = { _id: req.params.id, user: req.userId };
    const deleteComment = await Comment.findOneAndDelete(deleteCondition);
    if (!deleteComment) {
      return res.json({
        success: false,
        message: "Comment not found or User not authorised",
      });
    }
    return res.json({
      success: true,
      message: "DELETED",
      post: deleteComment,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error!" });
  }
});

/**
 * @route GET api/posts/followings/
 * @description GET FOLLOWING POSTS
 * @access Private
 */

router.get("/followings/:userId", verifyToken, async (req, res) => {
  try {
    const following = await Follow.find({ user: req.params.userId }).populate(
      "follow",
      ["username", "avatar", "name", "bio"]
    );
    const tmpArray = following.map((item) => item.follow);

    const followingPostsCondition = {
      $or: [
        ...tmpArray.map((user) => ({ user: user._id })),
        { user: req.params.userId },
      ],
    };

    const followingPosts = await Post.find(followingPostsCondition).populate(
      "user",
      ["username", "avatar", "name", "bio"]
    );
    return res.json({ success: true, message: "Success", followingPosts });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error!" });
  }
});

module.exports = router;

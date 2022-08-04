const express = require("express");
const router = express.Router();
const verifyToken = require("./../middleware/auth");

//MODELS
const User = require("../models/User");
const Follow = require("../models/Follow");

/**
 * @route POST api/follow
 * @description follow or unfollow user
 * @access Private
 */

router.post("/:userId", verifyToken, async (req, res) => {
  try {
    //check follow yourself
    if (req.params.userId === req.userId) {
      res.json({ success: false, message: "You cannot follow yourself!" });
    } else {
      //Find User want to follow
      const followUser = await User.findById(req.params.userId).select(
        "-password -createdAt"
      );
      if (!followUser) {
        res.json({ success: false, message: "User not found!" });
      } else {
        //Find Follow
        const followCondition = { user: req.userId, follow: req.params.userId };
        const deleteFollow = await Follow.findOneAndDelete(followCondition);
        //if not followed
        if (!deleteFollow) {
          const newFollow = new Follow({
            user: req.userId,
            follow: req.params.userId,
          });
          await newFollow.save();
          res.json({ success: true, message: "Followed!", follow: newFollow });
        } else {
          res.json({ success: true, message: "UnFollowed!" });
        }
      }
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error!" });
  }
});
/**
 * @route POST api/follow/following
 * @description get all user following
 * @access Private
 */
router.get("/followings/:userId", verifyToken, async (req, res) => {
  try {
    const followingsCondition = { user: req.params.userId };
    const followings = await Follow.find(followingsCondition).populate(
      "follow",
      ["username", "avatar", "name"]
    );
    const tmpArray = followings.map((item) => item.follow);
    res.json({ success: true, followings: tmpArray });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error!" });
  }
});

/**
 * @route POST api/follow/follower
 * @description get all user follower
 * @access Private
 */
router.get("/followers/:userId", verifyToken, async (req, res) => {
  try {
    const followersCondition = { follow: req.params.userId };
    const followers = await Follow.find(followersCondition).populate("user", [
      "username",
      "avatar",
      "name",
    ]);
    const tmpArray = followers.map((item) => item.user);
    res.json({ success: true, followers: tmpArray });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error!" });
  }
});

module.exports = router;

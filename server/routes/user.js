const express = require("express");
const verifyToken = require("../middleware/auth");
const User = require("./../models/User");
const router = express.Router();

/**
 * @route GET api/user/
 * @description get Info of user
 * @access Private
 */

router.get("/:userId", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select(
      "-password -createdAt"
    );
    if (!user) return res.json({ success: false, message: "User not found" });
    res.json({ success: true, user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error!" });
  }
});

/**
 * @route GET api/user/edit
 * @description edit Info of user
 * @access Private
 */

router.put("/edit", verifyToken, async (req, res) => {
  const { name, bio } = req.body;
  if (!name) return res.json({ success: false, message: "Name is required" });
  try {
    let updatedUser = { name, bio };
    const userUpdateCondition = { _id: req.userId };
    updatedUser = await User.findByIdAndUpdate(
      userUpdateCondition,
      updatedUser,
      { new: true }
    );
    // User not authorised to update post
    if (!updatedUser) {
      return res.json({
        success: false,
        message: "User not found or User not authorised",
      });
    }
    res.json({
      success: true,
      message: "Updated!",
      user: updatedUser,
    });
  } catch (error) {}
});

module.exports = router;

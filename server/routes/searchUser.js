const express = require("express");
const verifyToken = require("../middleware/auth");
const User = require("./../models/User");
const router = express.Router();

/**
 * @route GET api/search/
 * @description search user
 * @access Private
 */

router.get("/:name", verifyToken, async (req, res) => {
  try {
    const usersCondition = {
      $or: [
        { username: { $regex: req.params.name, $options: "i" } },
        { name: { $regex: req.params.name, $options: "i" } },
      ],
    };
    const users = await User.find(usersCondition).select(
      "-password -createdAt"
    );
    if (!users) {
      return res.json({ success: false, message: "User not found" });
    }
    res.json({ success: true, users });
  } catch (error) {}
});

module.exports = router;

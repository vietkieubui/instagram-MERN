const express = require("express");
const router = express.Router();
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
const User = require("./../models/User");
const verifyToken = require("../middleware/auth");

/**
 * @route GET api/auth/
 * @description check if user is loggedin
 * @access Public
 */

router.get("/", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    res.json({ success: true, user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error!" });
  }
});

/**
 * @route POST api/auth/register
 * @description register user
 * @access Public
 */

router.post("/register", async (req, res) => {
  const { name, username, password } = req.body;
  //simple validation
  if (!username || !password || !name) {
    return res
      .status(400)
      .json({ success: false, message: "Please fill all infomation!" });
  }
  try {
    //check for existing user
    const user = await User.findOne({ username });
    if (user) {
      return res
        .status(400)
        .json({ success: false, message: "Username already!" });
    }
    //all good
    const hashedPassword = await argon2.hash(password);
    const newUser = new User({
      name,
      username,
      password: hashedPassword,
    });
    await newUser.save();
    //return Token
    const accessToken = jwt.sign(
      { userId: newUser._id },
      process.env.ACCESS_TOKEN_SECRET
    );
    return res.json({
      success: true,
      message: "User created successfully!",
      accessToken,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error!" });
  }
});

/**
 * @route POST api/auth/login
 * @description login user
 * @access Public
 */

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  //simple validation
  if (!username || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Missing Username and/or Password" });
  }
  try {
    //check for existing user
    const user = await User.findOne({ username });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Incorrect Username or Password!" });
    }

    //user found
    const passwordValid = await argon2.verify(user.password, password);
    if (!passwordValid) {
      return res
        .status(400)
        .json({ success: false, message: "Incorrect Username or password!" });
    }
    //All good
    //return Token
    const accessToken = jwt.sign(
      { userId: user._id },
      process.env.ACCESS_TOKEN_SECRET
    );
    return res.json({
      success: true,
      message: " User Login successfully!",
      accessToken,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error!" });
  }
});

module.exports = router;

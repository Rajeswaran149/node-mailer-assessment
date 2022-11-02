const express = require("express");
const User = require("../model/user.js");
const sendMail = require("../utils/sendEmail");
const { isAuth } = require("../utils/token.js");
const { generateToekn } = require("../utils/token.js");

const userRouter = express.Router();

userRouter.post("/signup", async (req, res) => {
  try {
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    });
    const user = await newUser.save();
    res.send({ user });
  } catch (error) {
    res.status(400).json(error.message);
  }
});

userRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user.password == password) {
      await user.save();
      res.status(200).json("Login success");
      await sendMail(email, "Auth key", `${generateToekn(user)}`);
    } else {
      res.send("Invalid Credentials");
    }
  } catch (error) {
    res.status(400).json(error.message);
  }
});

userRouter.post("/forgetpassword", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    const newPassword = Math.random().toString(36).substring(2, 7);
    // const result = Math.random().toString(36).substring(2,7);
    if (user) {
      await User.updateOne({ password: newPassword });
      await sendMail(email, "New Password", `${newPassword}`);
      res.status(200).json("Password sent successfully");
    }
  } catch (error) {
    res.status(400).json(error.message);
  }
});

userRouter.post("/mailsend", isAuth, async (req, res) => {
  try {
    const { email, subject, text } = req.body;
    sendMail(email, subject, text);
    res.send("Email sent");
  } catch (error) {
    res.send("Error occured");
    console.log(error);
  }
});

module.exports = userRouter;

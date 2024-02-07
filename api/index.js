const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("./userModel");
const cookieParser = require("cookie-parser");

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

const connect = async () => {
  try {
    await mongoose.connect(
      
    );
    console.log("database connected");
  } catch (err) {
    console.log("DB failed to connect", err);
  }
};
connect();

//login

app.use("/api/login", async (req, res) => {
  const user = await User.findOne({ username: req.body.username });
  if (!user) return res.json("User not found!");

  const isPasswordCorrect = await bcrypt.compare(
    req.body.password,
    user.password
  );
  if (!isPasswordCorrect) return res.json("Wrong password or username!");

  const token = jwt.sign({ id: user._id }, "asghe", {
    expiresIn: "2d",
  });

//expire in two day (that 2 indicate day)

  const options = {
    expires: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), 
    httpOnly: true,
  };
  res.cookie("token", token, options);

  res.json({user});
});

//check token

const IsAuthenticated = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    res.json("Please Login to access this resource.");
  } else {
    const decodedData = jwt.verify(token, "asghe");
    const user = await User.findById(decodedData.id);
    if (!user) {
      res.json("Please Login to access this resource.");
    } else {
      req.user = user;
      next();
    }
  }
};

//use token

app.use("/api/me", IsAuthenticated, (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
});

//logout

app.use("/api/logout", (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged Out",
  });
});

app.listen(5000, console.log("server connected"));

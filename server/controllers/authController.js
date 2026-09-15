const bcrypt = require("bcryptjs");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // checking if user already exists
    const existingUser = await User.findOne({ email });

    if(existingUser) {
      return res.status(400).json({
        message: "User already exists"
      });
    }

    // Hashing Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Creating User
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role
    });

    res.status(201).json({
      message: "User added successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  }
  catch (error){
    res.status(500).json({
      message: "Error while creating user",
      error: error.message
    });
  }
};

const loginUser = async (req, res)  => {
  try{
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    // Find User by email or give error
    if(!user) {
      return res.status(400).json({
        message: "Invalid email or password"
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    // check password of email or give error
    if(!isPasswordCorrect) {
      return res.status(400).json({
        message: "Invalid email or Password"
      });
    }

    // Create JWT
    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d"
      }
    );

    // Put JWT inside cookie
    res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000
    });

    // Send response
    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch(error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message
    })
  }
};

const logoutUser = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });

  res.status(200).json({ message: "Logged out successfully" });
};

module.exports = {
  loginUser,
  logoutUser,
  registerUser
};

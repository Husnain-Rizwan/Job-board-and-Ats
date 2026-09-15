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

    // Keep a secure cookie for same-site/custom-domain deployments. The token is
    // also returned below because browsers can block a Render cookie when the
    // frontend is hosted on a different Vercel domain.
    const isProduction = process.env.NODE_ENV === "production";
    res.cookie("token", token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // Send response
    res.status(200).json({
      message: "Login successful",
      token,
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
  const isProduction = process.env.NODE_ENV === "production";
  res.clearCookie("token", {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
  });

  res.status(200).json({ message: "Logged out successfully" });
};

module.exports = {
  loginUser,
  logoutUser,
  registerUser
};

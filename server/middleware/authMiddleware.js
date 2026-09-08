const User = require("../models/User")
const jwt = require("jsonwebtoken");

const protect =async(req, res, next) => {
  try{
    const token = req.cookies.token;

    // checking if token exists
    if (!token) {
            return res.status(401).json({
                message: "Not authenticated"
            });
        }

    // Verify JWT
     const decoded = jwt.verify(
      token, 
      process.env.JWT_SECRET
     );

    //  verifying user still exists
     const user = await User.findById(decoded.userId);

     if(!user){
      return res.status(401).json({
        message: "not authorized"
      });
     }

    //  store decoded user information in request
     req.user = user;

     next();
  } catch(error) {
    return res.status(401).json({
      message: "invalid or expire token",      
    });
  }
};

module.exports = protect;
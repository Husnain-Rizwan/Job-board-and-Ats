const User = require("../models/User")
const jwt = require("jsonwebtoken");

const protect =async(req, res, next) => {
  try{
    // Prefer an Authorization header so a Vercel frontend can authenticate even
    // when the browser blocks cross-site (third-party) cookies from Render.
    // Keep the cookie fallback for same-site deployments and existing sessions.
    const authorization = req.headers.authorization || "";
    const bearerToken = authorization.startsWith("Bearer ")
      ? authorization.slice(7).trim()
      : null;
    const token = bearerToken || req.cookies.token;

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

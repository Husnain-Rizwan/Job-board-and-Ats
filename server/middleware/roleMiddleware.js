const authorize = (...allowedRoles) => {
  return(req, res, next) => {
   
    if(!req.user) {
      return res.status(400).json({
        message: "not authenticated"
      });
    }

    if(!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Access denied"
      });
    }

    next()
  };
};

module.exports = authorize; 
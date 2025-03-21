const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const User = require("../schema/userSchema");

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_TOKEN);
      req.user = await User.findById(decoded.id).select("-password");
      if (!req.user) {
        res.status(401);
        throw new Error("User not authirised");
      }
      next();
    } catch (error) {
      console.log(error);
      res.status(400);
      throw new Error("Not Authirised");
    }
  }

  if (!token) {
    res.status(400);
    throw new Error("Not Authirised User")
  }
});

module.exports = protect;

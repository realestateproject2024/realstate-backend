var jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

exports.requireSignin = (req, res, next) => {
  try {
    if (req.headers["authorization"]?.length > 0) {
      const token = req.headers["authorization"]?.split(" ")[1];
      if (token) {
        const user = jwt.verify(token, process.env.AUTH_SECRET_KEY);
        req.user = user;
        next();
      } else res.status(400).json({ message: "Admin/owner not found" });
    } else res.status(400).json({ message: "Authorization is required" });
  } catch (error) {
    res.status(400).json({ message: "Access denied" });
    console.log(error);
  }
};

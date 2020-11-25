const jwt = require("jsonwebtoken");
const Admin = require("../mongoose/models/admin");

const adminauth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, "ThisJwtTokenIsUsedToValidateTheUser");
    const admin = await Admin.findOne({
      _id: decoded._id,
      "tokens.token": token,
    });
    if (!admin) {
      throw new Error();
    }
    req.admin = admin;
    req.token = token;
    next();
  } catch (e) {
    res.status(400).send({ error: "Please authenticate" });
  }
};

module.exports = adminauth;

const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

//Setting up schema for admin
const adminSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    validate(value) {
      if (!value.match(/[A-Za-z ]{3,}/)) {
        throw new Error(
          "Coach name should have atleast 3 characters and should contains only alphabets"
        );
      }
    },
  },
  password: {
    type: String,
    required: true,
    validate(value) {
      if (value.length < 8) {
        throw new Error(
          "Make sure that the password contains atlest one uppercase character, one lowercase character, one special character, one numeral character and the length should be gerater than 7"
        );
      }
    },
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

//Generating jwt tokens while logging in
adminSchema.methods.generateJWTTokens = async function () {
  const admin = this;
  const token = jwt.sign(
    { _id: admin._id.toString() },
    "ThisJwtTokenIsUsedToValidateTheUser"
  );
  admin.tokens = admin.tokens.concat({ token });
  await admin.save();
  return token;
};

//hashing password before saving
adminSchema.pre("save", async function (next) {
  const admin = this;
  if (admin.isModified("password")) {
    admin.password = await bcrypt.hash(admin.password, 8);
  }
  next();
});

//restricting the information send to the user
adminSchema.methods.toJSON = function () {
  const admin = this;
  const adminObject = admin.toObject();
  delete adminObject.password;
  delete adminObject.tokens;
  return adminObject;
};

//checking the credentials
adminSchema.statics.findByCredentials = async (name, password) => {
  const admin = await Admin.findOne({ name });
  if (!admin) {
    throw new Error("Unable to login");
  }
  const isAnAdmin = await bcrypt.compare(password, admin.password);
  if (!isAnAdmin) {
    throw new Error("Unable to login");
  }
  return admin;
};

//setting up the model
const Admin = mongoose.model("Admin", adminSchema);

module.exports = Admin;

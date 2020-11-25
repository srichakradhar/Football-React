const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Players = require("../models/players");

//setting the schema for teams collection
const teamsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    validate(value) {
      if (value.length < 3) {
        throw new Error("Team name should not be lesser than 3 characters");
      }
    },
  },
  password: {
    type: String,
    required: true,
    validate(value) {
      if (value.length < 8) {
        throw new Error("Password should have atleast 8 characters");
      }
    },
  },
  country: {
    type: String,
    required: true,
    unique: true,
    validate(value) {
      if (!value.match(/[A-Za-z ]{3,}/)) {
        throw new Error(
          "Country name should have atleast 3 characters and should contain only alphabets and spaces"
        );
      }
    },
  },
  coach: {
    type: String,
    required: true,
    validate(value) {
      if (!value.match(/[A-Za-z ]{3,}/)) {
        throw new Error(
          "Coach name should have atleast 3 characters and should contains only alphabets and spaces"
        );
      }
    },
  },
  tokens: [
    {
      token: {
        type: String,
        required: "true",
      },
    },
  ],
  logo: {
    type: Buffer,
  },
});

//setting the foregin key to the players collection
teamsSchema.virtual("players", {
  ref: "Players",
  localField: "_id",
  foreignField: "belongsTo",
});

//hashing the password before saving the team
teamsSchema.pre("save", async function (next) {
  const team = this;
  if (team.isModified("password")) {
    team.password = await bcrypt.hash(team.password, 8);
  }
  next();
});

//deleting the players of a team when the team gets deleted
teamsSchema.pre("remove", async function (next) {
  const team = this;
  await Players.deleteMany({ belongsTo: team._id });
  next();
});

//validating the credentials
teamsSchema.statics.findByCredentials = async (name, password) => {
  const team = await Teams.findOne({ name });
  if (!team) {
    throw new Error("Unable to log in");
  }
  const isValidTeam = await bcrypt.compare(password, team.password);
  if (!isValidTeam) {
    throw new Error("Unable to log in");
    q;
  }
  return team;
};

//generate jwt tokens while a team is registering and logging in
teamsSchema.methods.generateJWTTokens = async function () {
  const team = this;
  const token = jwt.sign(
    { _id: team._id.toString() },
    "ThisJwtTokenIsUsedToValidateTheUser"
  );
  team.tokens = team.tokens.concat({ token });
  await team.save();
  return token;
};

//deleting the unwanted details that displayed to the user
teamsSchema.methods.toJSON = function () {
  const team = this;
  const teamObject = team.toObject();
  delete teamObject.password;
  delete teamObject.tokens;
  delete teamObject.logo;
  return teamObject;
};

//setting up the collection in the database
const Teams = mongoose.model("Teams", teamsSchema);

module.exports = Teams;

const mongoose = require("mongoose");

//setting up the schema for the players collection
const playerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    validate(value) {
      if (!value.match(/[A-Za-z ]{3,}/)) {
        throw new Error(
          "Coach name should have atleast 3 characters and should contains only alphabets"
        );
      }
    },
  },
  age: {
    type: Number,
    required: true,
  },
  noOfMatches: {
    type: Number,
    required: true,
  },
  goalsScored: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  inEleven: {
    type: Boolean,
    default: false,
  },
  belongsTo: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Teams",
  },
});

//setting up players collection
const Players = mongoose.model("Players", playerSchema);

module.exports = Players;

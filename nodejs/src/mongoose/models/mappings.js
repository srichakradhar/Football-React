const mongoose = require("mongoose");

const mappingsSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
  },
  name: {
    default: "",
    type: String,
  },
});

const Mappings = new mongoose.model("Mappings", mappingsSchema);

module.exports = Mappings;
const mongoose = require("mongoose");

const statesSchema = new mongoose.Schema({
  name: {
    type: String,
  },
});

module.exports = mongoose.model("States", statesSchema);

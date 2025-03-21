const mongoose = require("mongoose");

const countriesSchema = new mongoose.Schema({
  name: {
    type: String,
  },
});


module.exports = mongoose.model("Countries" , countriesSchema)
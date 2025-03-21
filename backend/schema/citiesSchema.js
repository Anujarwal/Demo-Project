const mongoose = require("mongoose");

const citiesSchema = new mongoose.Schema({
  name: {
    type: String,
  },
});


module.exports = mongoose.model("Cities" , citiesSchema)
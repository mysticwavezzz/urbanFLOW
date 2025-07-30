const mongoose = require("mongoose")

const Schema = mongoose.Schema({
  Identifier: Number,
  Time: Number,
})

module.exports = mongoose.model('Time_Database', Schema)
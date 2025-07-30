const mongoose = require("mongoose")

const Schema = mongoose.Schema({
  Identifier: Number,
  Blacklisted: Boolean,
})

module.exports = mongoose.model('Blacklisted_Database', Schema)
const mongoose = require("mongoose")

const Schema = mongoose.Schema({
  Identifier: Number,
  Muted: Boolean,
})

module.exports = mongoose.model('Muted_Database', Schema)
const mongoose = require("mongoose")

const Schema = mongoose.Schema({
  Identifier: Number,
  Kredits: Number,
})

module.exports = mongoose.model('Kredits_Database', Schema)
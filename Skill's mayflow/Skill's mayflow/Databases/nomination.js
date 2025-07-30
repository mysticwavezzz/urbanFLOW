const mongoose = require("mongoose")

const Schema = mongoose.Schema({
  Identifier: Number,
  CurrentElection: String,
})

module.exports = mongoose.model('Nomination_Database', Schema)
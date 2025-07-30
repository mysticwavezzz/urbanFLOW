const mongoose = require("mongoose")

const Schema = mongoose.Schema({
  Identifier: Number,
  pagertagid: String,
  pagerid: String,
})

module.exports = mongoose.model('Pager_Database_4', Schema)

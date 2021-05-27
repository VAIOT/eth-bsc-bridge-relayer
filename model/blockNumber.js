const mongoose = require('mongoose')

const Schema = mongoose.Schema

const BlockNumber = new Schema({
  bridgeMode: {
    type: String,
    required: true
  },
  originBlock: {
    type: Number
  },
  destinationBlock: {
    type: Number
  }
})

module.exports = mongoose.model('BlockNumber', BlockNumber, "block_number")
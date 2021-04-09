const mongoose = require('mongoose')

const Schema = mongoose.Schema

const Signature = new Schema({
  status: {
    type: String,
    required: true,
    enum: ['Pending', 'Complete']
  },
  nonce: {
    type: String,
    required: true
  },
  account: {
    type: String,
    required: true
  },
  signature: {
    type: String,
    required: true
  },
  tokenAmount: {
    type: String,
    required: true
  }
})

module.exports = mongoose.model('Signature', Signature)

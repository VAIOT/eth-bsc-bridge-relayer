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

if (process.env.MODE == "eth_to_bsc") {
  module.exports = mongoose.model('Signature', Signature, "eth_to_bsc_bridge")
} else if (process.env.MODE == "bsc_to_eth") {
  module.exports = mongoose.model('Signature', Signature, "bsc_to_eth_bridge")
}

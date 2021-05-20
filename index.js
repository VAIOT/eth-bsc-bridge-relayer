const express = require('express')
const listener = require('./services/listener')

const app = express()

var server = app.listen(process.env.PORT, function () {
  listener.tokenLockedListener()
  listener.tokenUnLockedListener()
})

module.exports = app

if ((process.env.MODE != "eth_to_bsc") && (process.env.MODE != "bsc_to_eth")) {
  server.close()
}
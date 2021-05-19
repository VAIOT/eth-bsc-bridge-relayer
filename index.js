
const express = require('express')
const bodyParser = require('body-parser')

const listener = require('./services/listener')
const controller = require('./api/controller')

const app = express()
app.use(bodyParser.json())

app.get('/getTransactions/:address', async function (req, res) {
  const address = req.params.address
  res.send(await controller.getAllTansaction(address))
})

app.get('/getClaim/:address', async function (req, res) {
  const address = req.params.address
  res.send(await controller.getClaim(address, res))
})

app.get('/canSwap/:address', async function (req, res) {
  const address = req.params.address
  res.send(await controller.canSwap(address))
})

var server = app.listen(process.env.PORT, function () {
  listener.tokenLockedListener()
  listener.tokenUnLockedListener()
})

module.exports = app

if ((process.env.MODE != "eth_to_bsc") && (process.env.MODE != "bsc_to_eth")) {
  server.close()
}

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

app.get('/getSignature/:address/:nonce', async function (req, res) {
  const address = req.params.address
  const nonce = req.params.nonce
  res.send(await controller.getSignature(address, nonce))
})

app.listen(process.env.PORT, function () {
  listener.tokenLockedListener()
  listener.tokenUnLockedListener()
})

module.exports = app

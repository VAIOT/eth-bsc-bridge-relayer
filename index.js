const express = require('express')
const listener = require('./services/listener')
const probe = require('kube-probe');
const cron = require('node-cron');

const app = express()

var server = app.listen(process.env.PORT, function () {
  listener.tokenLockedListener()
  listener.tokenUnLockedListener()
})

cron.schedule('* * * * *', function () {
  listener.cronTaskForOrgin()
  listener.cronTaskForDestination()
});

cron.schedule('*/15 * * * *', function () {
  listener.cronTaskForDestinationEvery15min()
  listener.cronTaskForOrginEvery15min()
});

module.exports = app

if ((process.env.MODE != "eth_to_bsc") && (process.env.MODE != "bsc_to_eth")) {
  server.close()
}

probe(app);
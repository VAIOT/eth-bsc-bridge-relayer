require('dotenv').config()

const ethers = require('ethers')
const fs = require('fs')
const signatureService = require('../services/signature-service')
const BlockNumber = require('../model/blockNumber')

const jsonBridge = JSON.parse(fs.readFileSync('./contracts/UpgradeableBridgeContract.json'))

const destinationProvider = new ethers.providers.JsonRpcProvider(process.env.DESTINATION_NETWORK_URL)
const destinationBridge = new ethers.Contract(process.env.DESTINATION_NETWORK_ADDRESS, jsonBridge.abi, destinationProvider)

const originProvider = new ethers.providers.JsonRpcProvider(process.env.ORIGIN_NETWORK_URL)
const originBridge = new ethers.Contract(process.env.ORIGIN_NETWORK_ADDRESS, jsonBridge.abi, originProvider)

function tokenLockedListener() {
  originBridge.on('TokensLocked', async (account, amount, nonce) => {
    console.log("TokensLocked: account- ", account, " amount- ", amount, " nonce- ", nonce)
    signatureService.createSignature(account, amount, nonce.toNumber())
  })
}

function tokenUnLockedListener() {
  destinationBridge.on('TokensUnlocked', function (account, amount, nonce) {
    console.log("TokensUnlocked: account- ", account, " amount- ", amount, " nonce- ", nonce)
    signatureService.setStatusComplete(account, amount, nonce, false)
  })
}

async function cronTaskForOrgin() {
  var latest = await BlockNumber.findOne({ bridgeMode: process.env.MODE }, 'originBlock').exec()
  if (latest == null) {
    await new BlockNumber({ bridgeMode: process.env.MODE, originBlock: 0, destinationBlock: 0 }).save()
    latest = 0
  }
  const currentBlockNumber = await originProvider.getBlockNumber()

  const update = { $set: { originBlock: currentBlockNumber } }
  await BlockNumber.updateOne({ bridgeMode: process.env.MODE }, update, function (err) {
    if (err) console.log(err)
  })

  const eventFilter = originBridge.filters.TokensLocked()
  const events = await originBridge.queryFilter(eventFilter, latest.originBlock, currentBlockNumber)

  if (events.length != 0) {
    events.forEach(function (entry) {
      signatureService.checkIfSignatureExist(entry.args.account, entry.args.amount, entry.args.nonce)
    });
  }
}

async function cronTaskForDestination() {
  var latest = await BlockNumber.findOne({ bridgeMode: process.env.MODE }, 'destinationBlock').exec()
  if (latest == null) {
    await new BlockNumber({ bridgeMode: process.env.MODE, originBlock: 0, destinationBlock: 0 }).save()
    latest = 0
  }
  const currentBlockNumber = await destinationProvider.getBlockNumber()

  const update = { $set: { destinationBlock: currentBlockNumber } }
  await BlockNumber.updateOne({ bridgeMode: process.env.MODE }, update, function (err) {
    if (err) console.log(err)
  })

  const eventFilter = destinationBridge.filters.TokensUnlocked()
  const events = await destinationBridge.queryFilter(eventFilter, latest.destinationBlock, currentBlockNumber)

  if (events.length != 0) {
    events.forEach(function (entry) {
      signatureService.setStatusComplete(entry.args.account, entry.args.amount, entry.args.nonce, true)
    });
  }
}

module.exports = {
  tokenLockedListener: tokenLockedListener,
  tokenUnLockedListener: tokenUnLockedListener,
  cronTaskForOrgin: cronTaskForOrgin,
  cronTaskForDestination: cronTaskForDestination
}

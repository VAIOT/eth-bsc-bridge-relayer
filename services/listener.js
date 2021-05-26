require('dotenv').config()

const ethers = require('ethers')
const fs = require('fs')
const signatureService = require('../services/signature-service')

const jsonBridge = JSON.parse(fs.readFileSync('./contracts/UpgradeableBridgeContract.json'))

const destinationProvider = new ethers.providers.JsonRpcProvider(process.env.DESTINATION_NETWORK_URL)
const destinationBridge = new ethers.Contract(process.env.DESTINATION_NETWORK_ADDRESS, jsonBridge.abi, destinationProvider)

const originProvider = new ethers.providers.JsonRpcProvider(process.env.ORIGIN_NETWORK_URL)
const originBridge = new ethers.Contract(process.env.ORIGIN_NETWORK_ADDRESS, jsonBridge.abi, originProvider)

function tokenLockedListener() {
  originBridge.on('TokensLocked', async (account, amount, nonce) => {
    console.log("TokensLocked: account- ", account, " amount- ", amount.toNumber(), " nonce- ", nonce.toNumber())
    signatureService.signOrder(account, amount, nonce.toNumber())
  })
}

function tokenUnLockedListener() {
  destinationBridge.on('TokensUnlocked', function (account, amount, nonce) {
    console.log("TokensUnlocked: account- ", account, " amount- ", amount.toNumber(), " nonce- ", nonce.toNumber())
    signatureService.setStatusComplete(account, amount, nonce)
  })
}

module.exports = {
  tokenLockedListener: tokenLockedListener,
  tokenUnLockedListener: tokenUnLockedListener
}

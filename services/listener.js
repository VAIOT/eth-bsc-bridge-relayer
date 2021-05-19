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
  originBridge.on('TokensLocked', async (account, amount) => {
    const nonce = await destinationBridge.getCurrentNonce(account)
    signatureService.signOrder(account, amount.toNumber(), nonce.toNumber() + 1)
  })
}

function tokenUnLockedListener() {
  destinationBridge.on('TokensUnlocked', function (account, amount) {
    signatureService.setStatusComplete(account, amount)
  })
}

module.exports = {
  tokenLockedListener: tokenLockedListener,
  tokenUnLockedListener: tokenUnLockedListener
}

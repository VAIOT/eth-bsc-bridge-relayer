require('dotenv').config()

const ethers = require('ethers')
const fs = require('fs')
const signatureService = require('../services/signature-service')

const jsonBridge = JSON.parse(fs.readFileSync('./contracts/UpgradeableBridgeContract.json'))

const provider = new ethers.providers.JsonRpcProvider()
const contract = new ethers.Contract(process.env.BRIDGE_ADDRESS, jsonBridge.abi, provider)

function tokenLockedListener () {
  contract.on('TokensLocked', async (account, amount) => {
    const nonce = await contract.getCurrentNonce(account)
    signatureService.signOrder(account, amount.toNumber(), nonce.toNumber() + 1)
  })
}

function tokenUnLockedListener () {
  contract.on('TokensUnlocked', function (account, amount) {
    signatureService.setStatusComplete(account, amount)
  })
}

module.exports = {
  tokenLockedListener: tokenLockedListener,
  tokenUnLockedListener: tokenUnLockedListener
}

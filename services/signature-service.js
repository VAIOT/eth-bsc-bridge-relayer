require('../config/db')
require('dotenv').config()

const ethers = require('ethers')
const Signature = require('../model/signature')

async function signOrder (address, amount, nonce) {
  const message = ethers.utils.solidityKeccak256(
    ['uint256', 'uint256', 'address'],
    [amount, nonce, address])

  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY)
  const messageBytes = ethers.utils.arrayify(message)

  const signature = await wallet.signMessage(messageBytes)

  const sig = new Signature({ status: 'Pending', nonce: nonce, account: address, signature: signature, tokenAmount: amount })
  sig.save()
  console.log('New signature has been created', signature)
}

async function getAllTansaction (address) {
  return await Signature.find({ account: address }, 'account tokenAmount nonce status').exec()
}

async function getSignature (address, nonce) {
  return await Signature.findOne({ account: address, nonce: nonce }, 'signature').exec()
}

function setStatusComplete (address, amount) {
  const update = { $set: { status: 'Complete' } }
  Signature.updateOne({ account: address, tokenAmount: amount }, update, function (err) {
    if (err) console.log(err)
  })
}

module.exports = {
  signOrder: signOrder,
  getAllTansaction: getAllTansaction,
  setStatusComplete: setStatusComplete,
  getSignature: getSignature
}

require('../config/db')
require('dotenv').config()

const ethers = require('ethers')
const Signature = require('../model/signature')

async function signOrder(address, amount, nonce) {
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

async function getAllTansaction(address) {
  return await Signature.find({ account: address }, 'account tokenAmount nonce status').exec()
}

async function getClaim(address, res) {
  const result = await Signature.findOne({ account: address, status: 'Pending' }, 'signature tokenAmount nonce').exec()
  if (!result)
    res.sendStatus(404)
  else
    return result;
}

async function canSwap(address) {
  return ! await Signature.exists({ account: address, status: "Pending" })
}

function setStatusComplete(address, amount, nonce) {
  const update = { $set: { status: 'Complete' } }
  Signature.updateOne({ account: address, tokenAmount: amount, nonce: nonce }, update, function (err) {
    if (err) console.log(err)
  })
}

module.exports = {
  signOrder: signOrder,
  getAllTansaction: getAllTansaction,
  setStatusComplete: setStatusComplete,
  getClaim: getClaim,
  canSwap: canSwap
}

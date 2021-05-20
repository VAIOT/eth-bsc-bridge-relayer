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

function setStatusComplete(address, amount, nonce) {
  const update = { $set: { status: 'Complete' } }
  Signature.updateOne({ account: address, tokenAmount: amount, nonce: nonce }, update, function (err) {
    if (err) console.log(err)
  })
}

module.exports = {
  signOrder: signOrder,
  setStatusComplete: setStatusComplete
}

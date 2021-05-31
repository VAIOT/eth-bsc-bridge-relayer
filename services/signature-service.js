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
  return signature
}

async function createSignature(address, amount, nonce) {
  const signature = await signOrder(address, amount, nonce)

  const sig = new Signature({ status: 'Pending', nonce: nonce, account: address, signature: signature, tokenAmount: amount })
  sig.save()
  console.log('New signature has been created', signature)
}

function setStatusComplete(address, amount, nonce, ifCron) {
  const update = { $set: { status: 'Complete' } }
  Signature.updateOne({ account: address, tokenAmount: amount, nonce: nonce }, update, function (err, docs) {
    if (err)
      console.log(err)
    else if (docs.nModified == "1") {
      if (ifCron)
        console.log("One document has been updated by synchronization task: account- ", address, " amount- ", amount, " nonce- ", nonce)
      else if (!ifCron)
        console.log("One document has been updated: account- ", address, " amount- ", amount, " nonce- ", nonce)
      else
        console.log("One document has been updated by synchronization task running every 15 min: account- ", address, " amount- ", amount, " nonce- ", nonce)
    }
  })
}

async function checkIfSignatureExist(address, amount, nonce, ifCron) {
  const signature = await signOrder(address, amount, nonce)

  if (! await Signature.exists({ nonce: nonce, account: address, signature: signature, tokenAmount: amount })) {
    const sig = new Signature({ status: 'Pending', nonce: nonce, account: address, signature: signature, tokenAmount: amount })
    sig.save()
    if (ifCron)
      console.log('New signature has been created by synchronization task', signature)
    else
      console.log('New signature has been created by synchronization task running every 15 min', signature)
  }
}

module.exports = {
  setStatusComplete: setStatusComplete,
  checkIfSignatureExist: checkIfSignatureExist,
  createSignature: createSignature
}

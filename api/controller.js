const signatureService = require('../services/signature-service')

function getAllTansaction (address) {
  return signatureService.getAllTansaction(address)
}

function getSignature (address, nonce) {
  return signatureService.getSignature(address, nonce)
}

module.exports = {
  getAllTansaction: getAllTansaction,
  getSignature: getSignature
}

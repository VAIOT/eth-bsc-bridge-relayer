const signatureService = require('../services/signature-service')

function getAllTansaction(address) {
  return signatureService.getAllTansaction(address)
}

function getClaim(address, res) {
  return signatureService.getClaim(address, res)
}

function canSwap(address) {
  return signatureService.canSwap(address)
}

module.exports = {
  getAllTansaction: getAllTansaction,
  getClaim: getClaim,
  canSwap: canSwap
}

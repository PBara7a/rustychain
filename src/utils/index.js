const EC = require("elliptic").ec;
const cryptographicHash = require("./cryptographicHash");

const ec = new EC("secp256k1"); // same curve as BTC

const verifySignature = ({ publicKey, data, signature }) => {
  const hashedData = cryptographicHash(data);
  const keyFromPublic = ec.keyFromPublic(publicKey, "hex");

  return keyFromPublic.verify(hashedData, signature);
};

module.exports = { ec, verifySignature, cryptographicHash };

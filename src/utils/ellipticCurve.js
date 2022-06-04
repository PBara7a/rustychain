const EC = require("elliptic").ec;

const ec = new EC("secp256k1"); // same curve as BTC

module.exports = { ec };

const crypto = require("crypto");

const cryptographicHash = (...args) => {
  // creates an object that can be used to update the hash content
  // and generate a hash digest using the specified algorithm
  const hash = crypto.createHash("sha256");

  // args are sorted so the hash is the same regardless of input order
  hash.update(args.sort().join(" "));

  return hash.digest("hex");
};

module.exports = cryptographicHash;

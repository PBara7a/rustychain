# blockchain-sandbox

This blockchain is being built using a **Test Driven Development** approach. The testing framework used to support this was **Jest**.

What I have learned building this project:

- Blockchain fundamentals:
  - Why a harcoded genesis block is necessary
  - How blocks are 'linked' to form a chain
  - Chain validation and chain replacement
  - What are the roles of nonce and difficulty when mining a block
  - How to prevent difficulty jumps
  - How binary hashes allow superior accuracy in difficulty adjustments, when compared with hex hashes (SHA-256: hex=64 chars, binary=256 bits)
- Exposed me to some different modules (crypto, hex-to-binary)

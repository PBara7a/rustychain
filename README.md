# blockchain-sandbox

This blockchain is being built using a **Test Driven Development** approach.

Technologies: Node.js, Jest, Express, PubNub.

What I have learned building this project:

- Blockchain fundamentals:
  - Why a harcoded genesis block is necessary
  - How blocks are 'linked' to form a chain
  - Chain validation and chain replacement
  - What are the roles of nonce and difficulty when mining a block
  - How to prevent difficulty jumps
  - How binary hashes allow superior accuracy in difficulty adjustments, when compared with hex hashes (SHA-256: hex=64 chars, binary=256 bits)
  - Broadcasting changes to the chain (used PubNub)
- Achievements:
  - Successful implementation of a simple blockchain
  - Set up an API that allows interaction with the backend via HTTP requests
  - Implemented a real-time messaging network to broadcast chains
  - Chains are synchronized when a new peer connects to the network

# Rustychain

## Tools and methodologies

The backend of this blockchain is being built using a **Test Driven Development** approach.

Technologies: **Node.js, Jest, Express, PubNub, React.**

<hr>

### While building this project:

- Accomplishments:

  - Built a simple blockchain with block validation and chain validation.
  - Set up an API that allows interaction with the backend via HTTP requests.
  - Implemented a real-time messaging network to broadcast chains and transactions.
  - A wallet with functionality to create signed transactions.
  - Built a React front end that can be used to interact with the blockchain.
  - Can start different peers locally, send transactions between them and verify that the chains remain in sync.

- Issues:

  - Messages are being broadcast to all nodes, including the one publishing the message.
  - Everything is being stored in memory.

- Next steps:
  - Better organization of files.
  - Make the chain data persistent.
  - User sign in and login to access their personal wallet.

<hr>

### Instructions

1. Clone the repository
2. Install dependencies: npm i
3. Start the app: npm start
4. Access the front end on http://localhost:3030
5. Start a peer: npm run dev-peer
6. Check the terminal and look for the line: [SERVER] Running on http://localhost:{PORT}/
7. Access the front end on http://localhost:{PORT} (the port found in the previous step)
8. Transact!

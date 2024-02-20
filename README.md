<div align="center">
    <img src="assets/vaiLogo.svg" alt="VAIOT Logo" width="400"/>
</div>
</br>

# ETH-BSC Bridge Relayer

The ETH-BSC Bridge Relayer facilitates secure and efficient token transfers between the Ethereum (ETH) and Binance Smart Chain (BSC) networks. It leverages smart
contracts and a backend relayer service to listen for lock and unlock events, manage transactions, and ensure seamless asset movement across chains.

## Features

<ul>
    <li>Token Locking and Unlocking: Listen for and handle token lock and unlock events across ETH and BSC.</li>
    <li>Signature Verification: Generate and verify signatures to secure transactions.</li>
    <li>Automated Synchronization: Use cron jobs to regularly sync bridge operations and ensure consistency.</li>
    <li>Upgradeable Smart Contracts: Deploy upgradeable contracts for flexibility and future improvements.</li>
</ul>

## Prerequisites

<ul>
    <li>Node.js (version 12.x or higher)</li>
    <li>MongoDB</li>
    <li>An Ethereum and a BSC wallet with testnet or mainnet tokens for testing</li>
</ul>

## Installation

Clone the repository

```bash
git clone https://github.com/VAIOT/eth-bsc-bridge-relayer.git
cd eth-bsc-bridge-relayer
```

Install dependencies

```bash
npm install
```

Set up environment variables

Copy the .env.example file to a new file named .env, and fill in your details:

```bash
PORT=<port_of_backend>
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net<dbname>
ORIGIN_NETWORK_URL=https://<ethereum_network>
DESTINATION_NETWORK_URL=https://<bsc_network>
ORIGIN_NETWORK_ADDRESS=<address_of_ethereum_bridge_contract>
DESTINATION_NETWORK_ADDRESS=<address_of_bsc_bridge_contract>
PRIVATE_KEY=<your_private_key_for_signing>
MODE=<eth_to_bsc or bsc_to_eth>
```

Start the application

```bash

npm start

```

Run cron jobs

The application automatically schedules cron jobs for syncing operations. Ensure your system allows cron job execution.

## Usage

<ul>
   <li> Listening for Events: The application listens for TokensLocked and TokensUnlocked events from the configured smart contracts on the Ethereum and BSC networks, respectively.</li>
    <li>Processing Transactions: Transactions are automatically processed and synced based on the events captured by the listeners.</li>
</ul>

## Smart Contracts

This project includes the UpgradeableBridgeContract, VAITokenBSC, and VaiTokenETH smart contracts. Deploy these contracts on the respective networks before using the bridge.

You can find them [here](https://github.com/VAIOT/eth-bsc-bridge-contracts).

## Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are greatly appreciated.

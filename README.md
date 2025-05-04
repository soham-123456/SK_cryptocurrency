# YDK Token ICO Sale

A decentralized ERC-20 token implementation with a web interface for token sales.

## Overview

This project implements the YDK Token (YDK), an ERC-20 compliant token on the Ethereum blockchain with an ICO sale mechanism. Users can purchase tokens using ETH through a clean, modern web interface.

## Features

- ERC-20 compliant smart contract
- Web-based token sale interface
- Real-time token purchase tracking
- MetaMask integration for secure transactions
- Responsive design

## Technologies Used

- Solidity ^0.4.2 (Smart Contracts)
- Truffle Framework (Development & Testing)
- Web3.js (Blockchain Interaction)
- Bootstrap (Frontend UI)
- HTML/CSS/JavaScript (Frontend)

## Prerequisites

- [Node.js](https://nodejs.org/) (v10.x or higher)
- [Truffle Framework](https://www.trufflesuite.com/truffle)
- [Ganache](https://www.trufflesuite.com/ganache) (for local blockchain development)
- [MetaMask](https://metamask.io/) (for connecting to the blockchain)

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/YashKakadiya008/ydk-token-sale.git
   cd ydk-token-sale
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start Ganache and create a workspace with this project's truffle-config.js

4. Compile and migrate the smart contracts:
   ```
   truffle compile
   truffle migrate --reset
   ```

5. Run the development server:
   ```
   npm run dev
   ```

6. Open your browser and navigate to http://localhost:3000

## Smart Contract Details

The YDK Token implements standard ERC-20 functionality including:
- Token transfers
- Allowance mechanism
- Approval system
- Total supply tracking

## Usage

1. Connect your MetaMask wallet to the application
2. Enter the number of tokens you wish to purchase
3. Confirm the transaction in MetaMask
4. View your updated token balance

## Testing

Run the test suite to ensure all contracts are functioning correctly:
```
truffle test
```

## Deployment

This DApp can be deployed to any Ethereum network (mainnet, testnet, or private network) by configuring the truffle-config.js file and running migrations.

## License

This project is licensed under the MIT License.

## Acknowledgments

- OpenZeppelin for secure smart contract standards
- Ethereum community for continuous support and development 

![image](https://github.com/user-attachments/assets/bc5b731d-5273-49bc-9792-550c634dd6f2)
![Screenshot 2025-05-04 132906](https://github.com/user-attachments/assets/265434d3-ebdc-4dd8-873c-8362729f1cde)


const HDWalletProvider = require('@truffle/hdwallet-provider');
require('dotenv').config();

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  networks: {
    development: {
      host: "127.0.0.1",
      port: "7545",
      network_id: "*" // match any network id
    },
    rinkeby: {
      provider: () => new HDWalletProvider(process.env.MNEMONIC, `https://rinkeby.infura.io/v3/${process.env.INFURA_API_KEY}`),
      network_id: 4,
      gas: 4700000,
      gasPrice: 10000000000
    },
    sepolia: {
      provider: () => new HDWalletProvider("public surprise way obtain rural loud catch hazard shoot misery acquire motor", `https://sepolia.infura.io/v3/baca774e7a10464c89563a0e3c0d9964`),
      network_id: 11155111,
      gas: 4700000,
      gasPrice: 10000000000
    }
  },
  compilers: {
    solc: {
      version: "0.4.17",
      settings: {
        optimizer: {
          enabled: true,
          runs: 200
        }
      }
    }
  }
};

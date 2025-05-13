module.exports = {
  networks: {
    ganache: {
      host: "localhost",        // Ganache default host
      port: 7545,               // Ganache default port
      network_id: "1337",       // Network ID of Ganache
      gas: 6721975,             // Gas limit (default is 6721975)
      gasPrice: 20000000000,    // Optional, set to 20 Gwei
    },
  },
  compilers: {
    solc: {
      version: "0.8.19",        // Solidity version (make sure it's the one you're using)
    },
  },
};

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // for more about customizing your Truffle configuration!
  networks: {
    local: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*", // Match any network id
      //gasPrice: 1,
      //gas: 6721975000, //672197500

    },
    ropsten: {
      network_id: 3,
      host: '127.0.0.1',
      port: 8545,
      gas: 6000000
    },
    //solc: {
    //  optimizer: {
    //    enabled: true,
    //    runs: 200
    //  }
    //}
  }
};

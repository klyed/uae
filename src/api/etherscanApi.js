import web3 from "web3";

const api = require("etherscan-api").init("Y79W58GXJEW8KYIEMU39AGZ2U44KCJS2ZS");
const tokenContractAddress = "0xbd149d3f7614b52f8a5e7e8986afd77e5d0e57cf";

export function getTokenBalance(address) {
  return new Promise(accept => {
    let paramData = web3.utils.sha3("balanceOf(address)").substring(0, 10);
    paramData =
      paramData +
      "000000000000000000000000" +
      address.substring(2, address.length);
    let getBalance = api.proxy.eth_call(
      tokenContractAddress,
      paramData,
      "latest"
    );
    getBalance.then(returnValue => {
      accept(parseInt(returnValue.result, 16) / 1000000000000000000);
    });
  });
}

export function getTxHistory(address) {
  let topicsFilter =
    "0x000000000000000000000000" + address.substring(2, address.length);
  let topicData = web3.utils.sha3("Transfer(address,address,uint256)");
  return new Promise(accept => {
    let logs = api.log.getLogs(tokenContractAddress, 1, "latest", topicData);
    logs.then(returnValue => {
      let addressRelatedRawTransactions = returnValue.result.filter(logItem => {
        return (
          logItem.topics[1] === topicsFilter ||
          logItem.topics[2] === topicsFilter
        );
      });
      let addressRelatedTransactions = addressRelatedRawTransactions.map(logItem => {
        return [
          logItem.transactionHash,
          "0x" + logItem.topics[1].substring(26, logItem.topics[1].length),
          "0x" + logItem.topics[2].substring(26, logItem.topics[2].length),
          parseInt(logItem.data, 16) / 1000000000000000000
        ];
      });
      accept(addressRelatedTransactions);
      return;
    });
  });
}

export function getContractAddress() {
  return tokenContractAddress;
}

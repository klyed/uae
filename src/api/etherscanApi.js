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
      accept(parseInt(returnValue.result) / 1000000000000000000);
    });
  });
}

export function getTxHistory(address) {
  let logs = api.log.getLogs(tokenContractAddress, 1, "latest");
  logs.then(returnValue => {
    console.log(returnValue);
  });
  return new Promise(accept => {
    var txList = api.account.tokentx(
      address,
      tokenContractAddress,
      1,
      "latest",
      "asc"
    );
    txList.then(returnValue => {
      console.log(returnValue);
    });
    if (address) {
      const result = [
        [
          "0xC5fdf4076b8F3A5357c5E395ab970B5B54098Fef",
          "0xC5fdf4076b8F3A5357c5E395ab970B5B54098Fef",
          "0xC5fdf4076b8F3A5357c5E395ab970B5B54098Fef",
          "3",
          "locked"
        ]
      ];
      accept(result);
      return;
    } else {
      accept([[]]);
      return;
    }
  });
}

export function getContractAddress() {
  return tokenContractAddress;
}

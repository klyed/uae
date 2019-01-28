const api = require("etherscan-api").init("Y79W58GXJEW8KYIEMU39AGZ2U44KCJS2ZS");
const tokenContractAddress = "0xbd149d3f7614b52f8a5e7e8986afd77e5d0e57cf";

export function getTokenBalance(address) {
  return new Promise(accept => {
    let balance = api.account.tokenbalance(address, "", tokenContractAddress);
    balance.then(returnValue => {
      accept(returnValue.result / 1000000000000000000);
      return;
    });
  });
}

export function getTxHistory(address) {
  return new Promise(accept => {
    if (address) {
      const result = [
        [
          "0xC5fdf4076b8F3A5357c5E395ab970B5B54098Fef",
          "0xC5fdf4076b8F3A5357c5E395ab970B5B54098Fef",
          "0xC5fdf4076b8F3A5357c5E395ab970B5B54098Fef",
          "3",
          "pending"
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

export function getTokenBalance(address) {
  return new Promise(accept => {
    if (address) {
      accept(1);
      return;
    } else {
      accept(0);
      return;
    }
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

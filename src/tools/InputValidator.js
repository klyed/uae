import web3 from "web3";

export default class InputValidator {
  static isEthereumAddress(address) {
    if (!address.startsWith("0x")) {
      return false;
    }
    return web3.utils.isAddress(address);
  }
}

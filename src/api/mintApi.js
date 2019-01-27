import cc from 'cryptocompare';
import crowdsaleConfiguratorJSON from '../contracts/Configurator.json';
import Web3 from 'web3';
import { BigNumber } from 'bignumber.js';

let tokenMintAccount = "0x6603cb70464ca51481d4edBb3B927F66F53F4f42";
let web3;

export function initWeb3() {
  let walletNeedsToBeUnlocked = false;
  return new Promise((accept) => {
    if (typeof global.window !== 'undefined') {
      // Modern dapp browsers...
      if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        walletNeedsToBeUnlocked = true;
      }
      // Legacy dapp browsers...
      else if (typeof global.window.web3 !== 'undefined') {
        // Use Mist/MetaMask's provider
        web3 = new Web3(window.web3.currentProvider);
      } else {
        // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
        web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
      }
    } else {
      // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
      web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
    }
    accept(walletNeedsToBeUnlocked);
    return;
  });
}

export function getNetwork() {
  return new Promise((accept, reject) => {
    web3.eth.net.getNetworkType().then(networkType => {
      accept(networkType);
      return;
    }).catch((e) => {
      reject(e);
      return;
    });
  });
}

export function unlockWallet() {
  return new Promise((accept, reject) => {
    window.ethereum.enable().then(() => {
      accept();
      return;
    }).catch(e => {
      reject(e);
      return;
    });
  });
}

export function loadAccounts() {
  return new Promise((accept, reject) => {
    web3.eth.getAccounts().then(allAccounts => {
      accept(allAccounts);
      return;
    }).catch((e) => {
      reject();
      return;
    });
  });
}

export function getEthBalance(account) {
  return new Promise((accept, reject) => {
    web3.eth.getBalance(account).then(wei => {
      let balance = web3.utils.fromWei(wei, 'ether');
      accept(balance);
      return;
    }).catch(e => {
      reject(e);
      return;
    });
  });
}

export function getTokenBalance(contractInstance, account) {
  return new Promise((accept, reject) => {
    contractInstance.methods.decimals().call().then((decimals) => {
      contractInstance.methods.balanceOf(account).call().then((balance) => {
        accept(balance / 10 ** decimals);
        return;
      }).catch(e => {
        reject(e);
        return;
      });
    }).catch(e => {
      reject(e);
      return;
    });
  });
}

function instantiateCrowdsaleContracts(contractJSON, contractCreator) {
  return new Promise((accept, reject) => {
    let myContract = new web3.eth.Contract(contractJSON.abi, {
      from: contractCreator,
      //gasPrice: '1000'
    });
    myContract.deploy({
      data: contractJSON.bytecode,
    }).send({
      from: contractCreator,
      gas: 6721975000000000, // was 4712388 // max gas willing to pay, should not exceed block gas limit
      gasPrice: 1
      //gasPrice: '1',
    }).on('error', (error) => {
      reject(error);
      return;
    }).on('transactionHash', (txHash) => {
      web3.eth.getTransactionReceipt(txHash).then(receipt => {
        accept(receipt);
        return;
      });
    });
  });
}

export function deployUAECrowdsale(owner) {
  return new Promise((accept, reject) => {
    getEthBalance(owner).then(accountBalanceETH => {
      instantiateCrowdsaleContracts(crowdsaleConfiguratorJSON, owner).then(crowdsaleReceipt => {
        accept({
          //tokenReceipt: tokenReceipt,
          crowdsaleReceipt: crowdsaleReceipt,
        });
        return;
      }).catch((e) => {
        console.log(e)
        reject(new Error("Could not deploy Configurator contract."));
        return;
      });
    }).catch((e) => {
      console.log(e);
      reject(new Error("Could not check token owner ETH funds."));
      return;
    });
  });
}

/**
 * Adds minter role to the new minter address, and renounces the minter role of the current minter.
 *
 * @param {string} tokenContractAddress       address of the deployed TokenMintERC20MintableToken contract
 * @param {string} currentMinterAddress       address of the current minter, to be renounced
 * @param {string} newMinterAddress           address that gets the minter role
 */
/*function transferMinterRole(tokenContractAddress, currentMinterAddress, newMinterAddress) {
  return new Promise((accept, reject) => {
    let tokenInstance = new web3.eth.Contract(TokenMintERC20MintableTokenJSON.abi, tokenContractAddress);
    tokenInstance.methods.addMinter(newMinterAddress).send({ from: currentMinterAddress }).then(() => {
      tokenInstance.methods.renounceMinter().send({ from: currentMinterAddress }).then(() => {
        accept();
        return;
      }).catch(() => {
        reject(new Error("Could not renounce minter role. Minter role address: " + currentMinterAddress));
        return;
      });
    }).catch(() => {
      reject(new Error("Could not add minter role. New minter role address: " + newMinterAddress));
      return;
    });
  });
}*/
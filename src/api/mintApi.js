import UAETokenJSON from '../contracts/UAEToken.json';
import CMIRPDCrowdsaleJSON from '../contracts/CMIRPDCrowdsale.json';
import Web3 from 'web3';
import { BigNumber } from 'bignumber.js';

let web3;

export const NO_NETWORK = "NO_NETWORK";

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

function instantiateCrowdsaleContracts(contractJSON, constructorArguments, contractCreator) {
  return new Promise((accept, reject) => {
    let myContract = new web3.eth.Contract(contractJSON.abi, {
      from: contractCreator,
      //gasPrice: '1000'
    });
    myContract.deploy({
      data: contractJSON.bytecode,
      arguments: [...constructorArguments],
    }).send({
      from: contractCreator,
      gas: 6721975, // was 4712388 // max gas willing to pay, should not exceed block gas limit
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

// initial supply is in full tokens, not weis, (1000 tokens with 18 decimals would make initialSupply = 1000)
function deployCrowdsaleToken(contractJSON, contractCreator, name, symbol, decimals, initialSupply, tokenOwner) {
  return new Promise((accept, reject) => {
    getEthBalance(tokenOwner).then(accountBalance => {
      // used for converting big number to string without scientific notation
      BigNumber.config({ EXPONENTIAL_AT: 100 });
      instantiateCrowdsaleContracts(contractJSON, [name, symbol, decimals, new BigNumber(initialSupply * 10 ** decimals).toString(), tokenOwner], contractCreator).then(receipt => {
        accept(receipt);
        return;
      }).catch((e) => {
        console.log(e);
        reject(new Error("Could not create crowdsale token contract."));
        return;
      });
    }).catch((e) => {
      reject(new Error("Could not check token owner ETH funds."));
      return;
    });
  });
}

/**
 * Deploys token and crowdsale contracts. First it deploys UAEToken,
 * and then CMIRPDCrowdsale.
 *
 * @param {string}   owner                    address used for deployments, contract creator
 * @param {Object[]} tokenArgs                array containing arguments for TokenMintERC20MintableToken deployment
 * @param {Object[]} crowdsaleArgs            array containing arguments for CMIRPDCrowdsale deployment
 * @return {Object}                           object containing token and crowdsale receipts
 */
export function deployTokenAndCrowdsale(owner, tokenArgs, crowdsaleArgs) {
  return new Promise((accept, reject) => {
    getEthBalance(owner).then(accountBalanceETH => {
      deployCrowdsaleToken(UAETokenJSON, owner, ...tokenArgs).then(tokenReceipt => {
        crowdsaleArgs[5] = tokenReceipt.contractAddress;
        instantiateCrowdsaleContracts(CMIRPDCrowdsaleJSON, crowdsaleArgs, owner).then(crowdsaleReceipt => {
          // add minter role to crowdsale contract
          let tokenInstance = new web3.eth.Contract(UAETokenJSON.abi, tokenReceipt.contractAddress);
          tokenInstance.methods.addMinter(crowdsaleReceipt.contractAddress).send({ from: owner }).then(() => {
            accept({
              tokenReceipt: tokenReceipt,
              crowdsaleReceipt: crowdsaleReceipt,
            });
            return;
          }).catch((e) => {
            console.log(e)
            reject(new Error("Could not transfer minter role."));
            return;
          });
        }).catch(() => {
          reject(new Error("Could not deploy CMIRPDCrowdsale contract."));
          return;
        });
      }).catch(() => {
        reject(new Error("Could not deploy UAEToken contract."));
        return;
      });
    }).catch(() => {
      reject(new Error("Could not check token owner ETH funds."));
      return;
    });
  });
}

/**
 * Deploys CMIRPDCrowdsale contract. 
 *
 * @param {string}   owner                    address used for deployments, contract creator
 * @param {Object[]} crowdsaleArgs            array containing arguments for CMIRPDCrowdsale deployment
 * @return {Object}                           object containing token and crowdsale receipts
 */
export function deployCrowdsale(owner, crowdsaleArgs) {
  return new Promise((accept, reject) => {
    getEthBalance(owner).then(accountBalanceETH => {
      instantiateCrowdsaleContracts(CMIRPDCrowdsaleJSON, crowdsaleArgs, owner).then(crowdsaleReceipt => {
        // add minter role to crowdsale contract
        let tokenInstance = new web3.eth.Contract(UAETokenJSON.abi, crowdsaleArgs[5]);
        tokenInstance.methods.addMinter(crowdsaleReceipt.contractAddress).send({ from: owner }).then(() => {
          accept({
            tokenReceipt: tokenReceipt,
            crowdsaleReceipt: crowdsaleReceipt,
          });
          return;
        }).catch((e) => {
          console.log(e)
          reject(new Error("Could not transfer minter role."));
          return;
        });
      }).catch(() => {
        reject(new Error("Could not deploy CMIRPDCrowdsale contract."));
        return;
      });
    }).catch(() => {
      reject(new Error("Could not check token owner ETH funds."));
      return;
    });
  });
}

/*function instantiateUAEContracts(contractJSON, contractCreator) {
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
      instantiateUAEContracts(crowdsaleConfiguratorJSON, owner).then(crowdsaleReceipt => {
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
}*/

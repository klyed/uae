/*jshint esversion: 6 */
import { expect } from 'chai';
import Web3 from 'web3';
const mintApi = require('../../src/api/mintApi');
import fetch from 'node-fetch';
import { BigNumber } from 'bignumber.js';
import UAETokenJSON from '../../src/contracts/UAEToken.json';
import CMIRPDCrowdsaleJSON from '../../src/contracts/CMIRPDCrowdsale.json';

let web3, accounts;
let icoMaker, investor1, investor2, investor3, party1, party2, party3;
let startTime = Math.round((new Date().getTime() + 2000) / 1000); // 2 seconds in future
let endTime = Math.round((new Date().getTime() + 6000) / 1000); // 6 seconds in future
let tokenArgs = ["Token name", "SYM", 18, 0, icoMaker];
let tokenServiceFeeETH = 0;
let crowdsaleServiceFeeETH = 0;

function runCrowdsale(crowdsaleArgs) {
  return new Promise((accept, reject) => {
    mintApi.deployCrowdsale(icoMaker, crowdsaleArgs).then(crowdsaleReceipt => {

      // pause tokens before crowdsale, no one can transfer
      let tokenInstance = new web3.eth.Contract(UAETokenJSON.abi, crowdsaleArgs[5]);
      tokenInstance.methods.pause().send({ from: icoMaker }).then(receipt => {

        // wait 3 seconds before first investment
        let delay = ms => new Promise((resolve) => setTimeout(resolve, ms));
        delay(3000).then(() => {

          // investor1 invests
          let crowdsaleInstance = new web3.eth.Contract(CMIRPDCrowdsaleJSON.abi, crowdsaleReceipt.contractAddress);
          crowdsaleInstance.methods.buyTokens(investor1).send({ from: investor1, gas: 4712388, value: web3.utils.toWei('0.06', 'ether') }).then(receipt => {

            // investor2 invests
            crowdsaleInstance.methods.buyTokens(investor2).send({ from: investor2, gas: 4712388, value: web3.utils.toWei('0.03', 'ether') }).then(receipt => {

              // wait 6 seconds so that crowdsale is closed (timed crowdsale)
              let delay = ms => new Promise((resolve) => setTimeout(resolve, ms));
              delay(6000).then(() => {
                // finalize sale after goal is reached, anyone can call
                crowdsaleInstance.methods.finalize().send({ from: icoMaker }).then(receipt => {

                  // investor1 withdraws tokens (this is where minting takes place)
                  crowdsaleInstance.methods.withdrawTokens(investor1).send({ from: investor1 }).then(() => {

                    // investor2 withdraws tokens (this is where minting takes place)
                    crowdsaleInstance.methods.withdrawTokens(investor2).send({ from: investor2 }).then(() => {

                      // get token supply after successful crowdsale
                      tokenInstance.methods.totalSupply().call().then(totalSupply => {

                        // mint 5% for party1
                        let party1Amount = new BigNumber(totalSupply).times(0.05).toString();
                        tokenInstance.methods.mint(party1, party1Amount).send({ from: icoMaker }).then(() => {
                          
                          // mint 20% for party2
                          let party2Amount = new BigNumber(totalSupply).times(0.20).toString();
                          tokenInstance.methods.mint(party2, party2Amount).send({ from: icoMaker }).then(() => {
                            accept(receipt);
                            return;
                          }).catch(e => {
                            reject(e);
                            return;
                          });
                        }).catch(e => {
                          reject(e);
                          return;
                        });
                      }).catch(e => {
                        reject(e);
                        return;
                      });
                    }).catch(e => {
                      reject(e);
                      return;
                    });
                  }).catch(e => {
                    reject(e);
                    return;
                  });
                }).catch(e => {
                  reject(e);
                  return;
                });
              });
            }).catch(e => {
              reject(e);
              return;
            });
          });
        }).catch(e => {
          reject(e);
          return;
        });
      }).catch(e => {
        reject(e);
        return;
      });
    }).catch(e => {
      reject(e);
      return;
    });
  }).catch(e => {
    console.log("----------------------------------------")
    console.log(e)
    return;
  });
};

describe('Deployment tests', function () {
  this.timeout(30000);

  before((beforeDone) => {
    // set global fetch because node doesn't have it
    global.fetch = fetch;
    web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
    web3.eth.getAccounts().then(allAccounts => {
      accounts = allAccounts;
      icoMaker = accounts[0];
      investor1 = accounts[1];
      investor2 = accounts[2];
      investor3 = accounts[3];
      party1 = accounts[4];
      party2 = accounts[5];
      party3 = accounts[6];
      tokenArgs[4] = icoMaker;
      beforeDone();
    });
  });

  beforeEach((done) => {
    mintApi.initWeb3();
    startTime = Math.round((new Date().getTime() + 2000) / 1000); // 2 seconds in future
    endTime = Math.round((new Date().getTime() + 6000) / 1000); // 6 seconds in future
    done();
  });

  

  /*it('Allocation - allocate 5% and 20% to two parties', (done) => {
    let crowdsaleArgs = [startTime, endTime, 1000, 999, icoMaker, null, web3.utils.toWei('0.1', 'ether'), web3.utils.toWei('0.03', 'ether'), 0];
    mintApi.deployTokenAndCrowdsale(icoMaker, tokenArgs, crowdsaleArgs).then(receipts => {
      expect(receipts.tokenReceipt.status).to.be.eq(true);
      expect(receipts.crowdsaleReceipt.status).to.be.eq(true);

      // pause tokens before crowdsale, no one can transfer
      let tokenInstance = new web3.eth.Contract(UAETokenJSON.abi, receipts.tokenReceipt.contractAddress);
      tokenInstance.methods.pause().send({ from: icoMaker }).then(receipt => {
        expect(receipt.status).to.be.eq(true);

        // check icoMaker's ETH balance before investment
        mintApi.getEthBalance(icoMaker).then(ethBalanceBefore => {

          // wait 3 seconds before first investment
          let delay = ms => new Promise((resolve) => setTimeout(resolve, ms));
          delay(3000).then(() => {
            // call buyTokens function of Crowdsale contract
            let crowdsaleInstance = new web3.eth.Contract(CMIRPDCrowdsaleJSON.abi, receipts.crowdsaleReceipt.contractAddress);
            crowdsaleInstance.methods.buyTokens(investor1).send({ from: investor1, gas: 4712388, value: web3.utils.toWei('0.06', 'ether') }).then(receipt => {
              expect(receipt.status).to.be.eq(true);

              // wait 6 seconds so that crowdsale is closed (timed crowdsale)
              let delay = ms => new Promise((resolve) => setTimeout(resolve, ms));
              delay(6000).then(() => {
                // finalize sale after goal is reached, anyone can call
                crowdsaleInstance.methods.finalize().send({ from: icoMaker }).then(receipt => {
                  expect(receipt.status).to.be.eq(true);

                  // withdraw tokens to investors address (this is where minting takes place)
                  crowdsaleInstance.methods.withdrawTokens(investor1).send({ from: investor1 }).then(() => {

                    // check investor's token balance after withdrawal, they received tokens through minting
                    mintApi.getTokenBalance(tokenInstance, investor1).then(actualTokenBalance => {
                      expect(parseInt(actualTokenBalance)).to.be.eq(60);
                      
                      // check icoMaker's ETH balance after successful crowdsale, should increase
                      mintApi.getEthBalance(icoMaker).then(ethBalanceAfter => {
                        expect(parseFloat(ethBalanceAfter) - (parseFloat(ethBalanceBefore) + 0.06)).to.be.lessThan(0.0025); // just 1 tx fee

                        // try to transfer newly created tokens, should not be allowed 
                        tokenInstance.methods.transfer(investor2, new BigNumber(20 * 10 ** tokenArgs[2]).toString()).send({ from: investor1 }).then(() => {
                          done(new Error('Transfer tokens successfully called when token is paused.'));
                        }).catch(() => {
                          // get token supply after successful crowdsale
                          tokenInstance.methods.totalSupply().call().then(totalSupply => {

                            // mint 5% for party1
                            let party1Amount = new BigNumber(totalSupply).times(0.05).toString();
                            tokenInstance.methods.mint(party1, party1Amount).send({ from: icoMaker }).then(() => {

                              // check party1 token balance after minting
                              mintApi.getTokenBalance(tokenInstance, party1).then(actualTokenBalance => {
                                expect(parseInt(actualTokenBalance)).to.be.eq(3);
                                
                                // mint 20% for party2
                                let party2Amount = new BigNumber(totalSupply).times(0.20).toString();
                                tokenInstance.methods.mint(party2, party2Amount).send({ from: icoMaker }).then(() => {

                                  // check party2 token balance after minting
                                  mintApi.getTokenBalance(tokenInstance, party2).then(actualTokenBalance => {
                                    expect(parseInt(actualTokenBalance)).to.be.eq(12);
                                    done();
                                  }).catch(e => {
                                    done(new Error(e));
                                  });
                                }).catch(e => {
                                  done(new Error(e));
                                });
                              }).catch(e => {
                                done(new Error(e));
                              });
                            }).catch(e => {
                              done(new Error(e));
                            });
                          }).catch(e => {
                            done(new Error(e));
                          });
                        });
                      }).catch(e => {
                        done(new Error(e));
                      });
                    }).catch(e => {
                      done(new Error(e));
                    });
                  }).catch(e => {
                    done(new Error(e));
                  });
                }).catch(e => {
                  done(new Error(e));
                });
              });
            }).catch(e => {
              done(new Error(e));
            });
          });
        }).catch(e => {
          done(new Error(e));
        });
      }).catch(e => {
        done(new Error(e));
      });
    }).catch(e => {
      done(new Error(e));
    });
  });*/

  it('Multi-stage', (done) => {
    let tokenArgs = ["Token name", "SYM", 18, 0, icoMaker];
    let crowdsaleArgs = [startTime, endTime, 1000, 999, icoMaker, null, web3.utils.toWei('0.1', 'ether'), web3.utils.toWei('0.03', 'ether'), 0];
    mintApi.deployToken(UAETokenJSON, icoMaker, ...tokenArgs).then((tokenReceipt) => {
      //console.log(tokenReceipt);
      crowdsaleArgs[5] = tokenReceipt.contractAddress;
      runCrowdsale(crowdsaleArgs).then(() => {
        console.log("crowdsale1 done");
        runCrowdsale(crowdsaleArgs).then(() => {
          console.log("crowdsale2 done");
          runCrowdsale(crowdsaleArgs).then(() => {
            console.log("crowdsale3 done");
           
            done();
          }).catch(e => {
            console.log(e)
            done(new Error(e));
          });
        }).catch(e => {
          console.log(e)
          done(new Error(e));
        });
      }).catch(e => {
        console.log(e)
        done(new Error(e));
      });
    }).catch(e => {
      console.log(e)
      done(new Error(e));
    });
  });
});

/*jshint esversion: 6 */
import { expect } from 'chai';
import Web3 from 'web3';
const mintApi = require('../../src/api/mintApi');
import fetch from 'node-fetch';

let web3, accounts;
let icoMaker, investor1, investor2, investor3;
let tokenArgs = ["Token name", "SYM", 18, 0, icoMaker];


describe('UAECrowdsale integration tests', function () {
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

  /*it('Deploy UAECrowdsale contract', (done) => {
    mintApi.deployUAECrowdsale(icoMaker).then(receipts => {
      expect(receipts.crowdsaleReceipt.status).to.be.eq(true);
      done();
    }).catch(e => {
      done(new Error(e));
    });
  });*/
});

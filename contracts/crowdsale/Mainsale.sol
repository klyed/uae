pragma solidity ^0.4.24;

import './StagedCrowdsale.sol';
import './UAECommonSale.sol';

contract Mainsale is StagedCrowdsale, UAECommonSale {

  address public UAEcompanyTokensWallet;
  
  address public SoftwareTokensWallet;
  
  address public ReservesForExchangeTokensWallet;
 
  address public MentorsTokensWallet;

  address public bountyTokensWallet;

  uint public UAEcompanyTokensPercent;
  
  uint public SoftwareTokensPercent;
  
  uint public ReservesForExchangeTokensPercent;
  
  uint public bountyTokensPercent;
  
  uint public MentorsTokensPercent;
  
  
  function setSoftwareTokensPercent(uint newSoftwareTokensPercent) public onlyOwner {
    SoftwareTokensPercent = newSoftwareTokensPercent;
  }

  function setReservesForExchangeTokensPercent(uint newReservesForExchangeTokensPercent) public onlyOwner {
    ReservesForExchangeTokensPercent = newReservesForExchangeTokensPercent;
  }
   
  function setUAEcompanyTokensPercent(uint newUAEcompanyTokensPercent) public onlyOwner {
    UAEcompanyTokensPercent = newUAEcompanyTokensPercent;
  }

  function setMentorsTokensPercent(uint newMentorsTokensPercent) public onlyOwner {
    MentorsTokensPercent = newMentorsTokensPercent;
  }

 function setSoftwareTokensWallet(address newSoftwareTokensWallet) public onlyOwner {
    SoftwareTokensWallet = newSoftwareTokensWallet;
  }

  function setBountyTokensPercent(uint newBountyTokensPercent) public onlyOwner {
    bountyTokensPercent = newBountyTokensPercent;
  }
 
  function setUAEcompanyTokensWallet(address newUAEcompanyTokensWallet) public onlyOwner {
    UAEcompanyTokensWallet = newUAEcompanyTokensWallet;
  }

 function setReservesForExchangeTokensWallet(address newReservesForExchangeTokensWallet) public onlyOwner {
    ReservesForExchangeTokensWallet = newReservesForExchangeTokensWallet;
  }
  
  function setBountyTokensWallet(address newBountyTokensWallet) public onlyOwner {
    bountyTokensWallet = newBountyTokensWallet;
  }
  
  function setMentorsTokensWallet(address newMentorsTokensWallet) public onlyOwner {
    MentorsTokensWallet = newMentorsTokensWallet;
  }

  function calculateTokens(uint _invested) internal returns(uint) {
    uint milestoneIndex = currentMilestone(start);
    Milestone storage milestone = milestones[milestoneIndex];
    uint tokens = _invested.mul(price).div(1 ether);
    uint valueBonusTokens = getValueBonusTokens(tokens, _invested);
    if(milestone.bonus > 0) {
      tokens = tokens.add(tokens.mul(milestone.bonus).div(percentRate));
    }
    return tokens.add(valueBonusTokens);
  }

  function finish() public onlyOwner {
    uint summaryTokensPercent = bountyTokensPercent.add(UAEcompanyTokensPercent).add(MentorsTokensPercent).add(ReservesForExchangeTokensPercent).add(SoftwareTokensPercent);
    uint mintedTokens = token.totalSupply();
    uint allTokens = mintedTokens.mul(percentRate).div(percentRate.sub(summaryTokensPercent));
    uint SoftwareTokens = allTokens.mul(SoftwareTokensPercent).div(percentRate);
    uint UAEcompanyTokens = allTokens.mul(UAEcompanyTokensPercent).div(percentRate);
    uint ReservesForExchangeTokens = allTokens.mul(ReservesForExchangeTokensPercent).div(percentRate);
    uint MentorsTokens = allTokens.mul(MentorsTokensPercent).div(percentRate);
    uint bountyTokens = allTokens.mul(bountyTokensPercent).div(percentRate);
    mintTokens(ReservesForExchangeTokensWallet, ReservesForExchangeTokens);
    mintTokens(UAEcompanyTokensWallet, UAEcompanyTokens);
    mintTokens(SoftwareTokensWallet, SoftwareTokens);
    mintTokens(bountyTokensWallet, bountyTokens);
    mintTokens(MentorsTokensWallet, MentorsTokens);
    token.finishMinting();
  }

  function endSaleDate() public view returns(uint) {
    return lastSaleDate(start);
  }
}
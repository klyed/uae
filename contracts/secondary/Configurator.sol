pragma solidity ^0.4.24;

import './token/UAEToken.sol';
import './crowdsale/Presale.sol';
import './crowdsale/Mainsale.sol';
import './crowdsale/UAECommonSale.sol';

contract Configurator is Ownable {

  UAEToken public token;

  Presale public presale;

  Mainsale public mainsale;

  function deploy() public onlyOwner {
    //owner = 0x83Af3226ca6d215F31dC0Baa0D969C06A1E5db3b;

    token = new UAEToken();

    presale = new Presale();

    presale.setWallet(0x83Af3226ca6d215F31dC0Baa0D969C06A1E5db3b);
    presale.setStart(1524009600);
    presale.setPeriod(14);
    presale.setPrice(730000000000000000000);
    presale.setHardcap(600000000000000000000);
    token.setSaleAgent(presale);
    commonConfigure(presale, token);

    extraCall();
    /*mainsale = new Mainsale();

    mainsale.addMilestone(14,20);
    mainsale.addMilestone(14,10);
    mainsale.addMilestone(14,0);
	
  
      
    mainsale.setPrice(520000000000000000000);
    mainsale.setWallet(0x83Af3226ca6d215F31dC0Baa0D969C06A1E5db3b);
    mainsale.setReservesForExchangeTokensWallet(0x83Af3226ca6d215F31dC0Baa0D969C06A1E5db3b);
    mainsale.setUAEcompanyTokensWallet(0x96E187bdD7d817275aD45688BF85CD966A80A428);
    mainsale.setBountyTokensWallet(0x83Af3226ca6d215F31dC0Baa0D969C06A1E5db3b);
    mainsale.setMentorsTokensWallet(0x66CeD6f10d77ae5F8dd7811824EF71ebC0c8aEFf);
    mainsale.setSoftwareTokensWallet(0x83Af3226ca6d215F31dC0Baa0D969C06A1E5db3b);
    mainsale.setStart(1525219200);
    mainsale.setHardcap(173000000000000000000000);
   
    mainsale.setReservesForExchangeTokensPercent(2);
    mainsale.setUAEcompanyTokensPercent(20);
    mainsale.setMentorsTokensPercent(10);
    mainsale.setBountyTokensPercent(5);
    mainsale.setSoftwareTokensPercent(1);
    commonConfigure(mainsale, token);
	
    presale.setMainsale(mainsale);

    token.transferOwnership(owner);
    presale.transferOwnership(owner);
    mainsale.transferOwnership(owner);*/
  }

  function commonConfigure(address saleAddress, address _token) internal {
     UAECommonSale  sale = UAECommonSale (saleAddress);
     sale.addValueBonus(1000000000000000000,0);
     sale.setReferalsMinInvestLimit(500000000000000000);
     sale.setRefererPercent(15);
     sale.setMinInvestedLimit(500000000000000000);
     sale.setToken(_token);
  }

  function extraCall() internal {
    mainsale = new Mainsale();

    //mainsale.addMilestone(14,20);
    //mainsale.addMilestone(14,10);
    //mainsale.addMilestone(14,0);
  }
}
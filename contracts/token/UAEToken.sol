pragma solidity ^0.4.24;

import './MintableToken.sol';

contract UAEToken is MintableToken {

  string public constant name = "UAE";
  string public constant symbol = "UAE Token";
  uint32 public constant decimals = 18;
}
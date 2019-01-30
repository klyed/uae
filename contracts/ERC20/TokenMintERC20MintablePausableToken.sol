pragma solidity ^0.4.24;

import '../open-zeppelin-contracts/token/ERC20/ERC20Mintable.sol';
import '../open-zeppelin-contracts/token/ERC20/ERC20Pausable.sol';

/**
 * @title TokenMintERC20MintablePausableToken
 * @author TokenMint.io
 * @dev Mintable and pausable ERC20 token with optional functions implemented. 
 * When token is paused, no one can transfer or approve tokens, but more tokens 
 * can be minted by minter.
 * Minting can be used for multi-stage ICO where the current minter adds
 * a minter role to crowdsale contract. After all crowdfunding stages minter 
 * should renounce his minter role.
 * For full specification of ERC-20 standard see:
 * https://github.com/ethereum/EIPs/blob/master/EIPS/eip-20.md
 */
contract TokenMintERC20MintablePausableToken is ERC20Mintable, ERC20Pausable {

    string private _name;
    string private _symbol;
    uint8 private _decimals;

    constructor(string name, string symbol, uint8 decimals, uint256 initialSupply, address tokenOwnerAddress) public payable {
      _name = name;
      _symbol = symbol;
      _decimals = decimals;

      // set tokenOwnerAddress as owner of initial supply, more tokens can be minted later
      _mint(tokenOwnerAddress, initialSupply);
    }

    // optional functions from ERC20 stardard

    /**
     * @return the name of the token.
     */
    function name() public view returns (string) {
      return _name;
    }

    /**
     * @return the symbol of the token.
     */
    function symbol() public view returns (string) {
      return _symbol;
    }

    /**
     * @return the number of decimals of the token.
     */
    function decimals() public view returns (uint8) {
      return _decimals;
    }
}

pragma solidity ^0.4.24;

import "../open-zeppelin-contracts/token/ERC20/ERC20Mintable.sol";
import "../open-zeppelin-contracts/crowdsale/validation/CappedCrowdsale.sol";
import "../open-zeppelin-contracts/crowdsale/emission/MintedCrowdsale.sol";
import "../open-zeppelin-contracts/crowdsale/price/IncreasingPriceCrowdsale.sol";
import "../open-zeppelin-contracts/crowdsale/distribution/RefundablePostDeliveryCrowdsale.sol";

/**
 * @title CMIRPDCrowdsale
 * @dev CMIRPDCrowdsale is an ERC-20 tokens crowdsale. Contract uses ETH as a fund raising currency. Features:
 *   - Capped - has a cap (maximum, hard cap) on ETH funds raised
 *   - Minted - new tokens are minted during crowdsale
 *   - Timed - has opening and closing time
 *   - Increasing price - price increases linearly from the opening to the closing time
 *   - Refundable - has a goal (minimum, soft cap), if not exceeded, funds are returned to investors
 *   - PostDelivery - tokens are withdrawn after crowsale is successfully finished, if tokens not paused
 * @author TokenMint.io
 */
contract CMIRPDCrowdsale is CappedCrowdsale, MintedCrowdsale, IncreasingPriceCrowdsale, RefundablePostDeliveryCrowdsale {

    // minimum amount of wei needed for single investment
    uint256 private _minimumInvestmentWei;

    /**
    * @dev Constructor, creates CMIRPDCrowdsale.
    * @param openingTime Crowdsale opening time
    * @param closingTime Crowdsale closing time
    * @param initialRate How many smallest token units a buyer gets per wei at the beginning of the crowdsale
    * @param finalRate How many smallest token units a buyer gets per wei at the end of the crowdsale
    * @param fundRaisingAddress Address where raised funds will be transfered if crowdsale is successful
    * @param tokenContractAddress ERC20Mintable contract address of the token being sold, already deployed
    * @param cap Cap on funds raised (maximum, hard cap)
    * @param goal Goal on funds raised (minimum, soft cap)
    * @param minimumInvestmentWei Minimum amount of wei needed for single investment
    */
    constructor (
        uint256 openingTime,
        uint256 closingTime,
        uint256 initialRate,
        uint256 finalRate,
        address fundRaisingAddress,
        ERC20Mintable tokenContractAddress,
        uint256 cap,
        uint256 goal,
        uint256 minimumInvestmentWei
    )
        public payable
        Crowdsale(initialRate, fundRaisingAddress, tokenContractAddress)
        CappedCrowdsale(cap)
        TimedCrowdsale(openingTime, closingTime)
        IncreasingPriceCrowdsale(initialRate, finalRate)
        RefundableCrowdsale(goal)
    {
        // As goal needs to be met for a successful crowdsale
        // the value needs to less or equal than a cap which is limit for accepted funds
        require(goal <= cap);

        // set minimum investment
        _minimumInvestmentWei = minimumInvestmentWei;
    }

    /**
     * @return minimum investment amount in wei
     */
    function minimumInvestmentWei() public view returns (uint256) {
        return _minimumInvestmentWei;
    }

    /**
     * @dev Extend parent behavior requiring purchase to respect the minimum investment amount in wei
     * @param beneficiary Token purchaser
     * @param weiAmount Amount of wei contributed
     */
    function _preValidatePurchase(address beneficiary, uint256 weiAmount) internal view {
        super._preValidatePurchase(beneficiary, weiAmount);
        require(weiAmount >= _minimumInvestmentWei);
    }
}

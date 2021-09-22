// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";


contract PledgeToken is ERC20{
    constructor(uint256 supply, address owner) ERC20("Pledge", "demo"){
        _mint(owner, supply);
    }
}
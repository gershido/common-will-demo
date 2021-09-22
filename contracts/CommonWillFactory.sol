//// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;


import "@openzeppelin/contracts/proxy/Clones.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./CommonWill.sol";


/// @notice Factory for Common Will processes with single executor
contract CommonWillFactory {
    CommonWill private master;

    event CommonWillCreated(address initialiser, address newCommonWill, bytes32 conditionDataId);

    /**
     * @notice Constructor for CommonWillFactory contract
     * @param _master Master implementation for the Common Will
     */
    constructor(address _master) {
        master = CommonWill(_master);
    }

    /**
    * @param _judge The judge in the process
    * @param _conditionDataId Identifier of the condition for process success, e.g. an IPFS content identifier
    * @param _processDueTime Final time of the process. If this time is reached with no suceess of the executor, 
       the process is considered as failed and pledgers can withraw their pledge
    * @param _minPledge Minimal pledge required to reach within a predefined time. If not reached the process is considered 
       as failed and pledgers can withraw their pledge
    * @param _minPledgeDueTime predefined time for the minimal pledge to be reached
    * @param _pledgeToken The pledge token in the process
    */
    function createCommonWill(
        address _judge,
        bytes32 _conditionDataId,
        uint _processDueTime,
        uint _minPledge,
        uint _minPledgeDueTime,
        address _pledgeToken
    )
        external
    {
        address proxy = Clones.clone(address(master));
        CommonWill(proxy).initialize(_judge, _processDueTime, _minPledge, _minPledgeDueTime,
            _pledgeToken);

        emit CommonWillCreated(msg.sender, proxy, _conditionDataId);
    }
}
   

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/proxy/utils/Initializable.sol";

/// @notice Common Good process 
contract CommonWill is Initializable { 

    enum Status{PROCESS_ACTIVE, PROCESS_SUCCESS, PROCESS_FAILURE}

    Status public status; 
    address public judge;
    uint public processDueTime;
    uint public minPledge;
    uint public minPledgeDueTime;
    mapping(address => uint) public pledges;
    IERC20 public pledgeToken;
    uint public totalPledge;

    event Pledge(address indexed from, uint amount);
    event Success(address winner);
    event TimeOutProcess(uint time);
    event TimeOutMinPledge(uint time, uint totalPledge);
    event WithrawPledge(address indexed supporter, uint amount);
    event Redeem(address indexed redeemer, uint executorTokensAmount, uint gain);

    /**
    * @param _judge The judge in the process
    * @param _processDueTime Final time of the process. If this time is reached with no suceess of the executor, 
       the process is considered as failed and pledgers can withraw their pledge
    * @param _minPledge Minimal pledge required to reach within a predefined time. If not reached the process is considered 
       as failed and pledgers can withraw their pledge
    * @param _minPledgeDueTime predefined time for the minimal pledge to be reached
    * @param _pledgeToken The pledge token in the process
    */
    function initialize(
        address _judge,
        uint _processDueTime,
        uint _minPledge,
        uint _minPledgeDueTime,
        address _pledgeToken
        )
        public initializer
    { 
        judge = _judge;
        processDueTime = _processDueTime;
        minPledge = _minPledge;
        minPledgeDueTime = _minPledgeDueTime;
        pledgeToken = IERC20(_pledgeToken);
        status = Status.PROCESS_ACTIVE;
    }

    /**
    * @notice Called by the judge to decide that an executor succeeded. Allowed only after minimal pledge time and amount have
    *  been reached and before process timeout.
    */
    function judgeSuccess(address winner) public 
    {
        require(msg.sender == judge, "Only judge");
        require(!timeOutMinPledge(), "Minimal pledge timeout");
        require(!timeOutProcess(), "Process timeout");
        require(block.timestamp > minPledgeDueTime, "Only after minimal pledge time");

        uint totalPledgeTemp = totalPledge;
        totalPledge = 0;
        status = Status.PROCESS_SUCCESS;
        pledgeToken.transfer(winner, totalPledgeTemp);
        emit Success(winner);
    }

    /**
    * @notice Contribute a pledge for the process. Allowed while the process has not timed out or has been finalized by the judge
    * @param amount The amount of tokens to pledge
    * @dev An approve of the ERC20 token is required before calling this function  
    */
    function pledge(uint amount) public  {
        if (status != Status.PROCESS_ACTIVE || timeOutMinPledge() || timeOutProcess()){
            revert("Pledge window is closed");
        }

        pledgeToken.transferFrom(msg.sender, address(this), amount);
        totalPledge += amount;
        pledges[msg.sender] += amount;
        emit Pledge(msg.sender, amount);
    }


    /**
    * @notice Withraw pledge in case the process has failed
    */
    function withrawPledge() public 
    {
        uint pledgeAmount = pledges[msg.sender];
        require(pledgeAmount > 0, "Only pledgers");
        if (status == Status.PROCESS_FAILURE ||
            timeOutMinPledge() || 
            timeOutProcess())
        {
            pledges[msg.sender] = 0; 
            totalPledge -= pledgeAmount;
            pledgeToken.transfer(msg.sender, pledgeAmount);
            emit WithrawPledge(msg.sender, pledgeAmount);
        }
        else{
            revert("withraw not allowed currently");
        }
    }

    /**
    * @notice check if process timeout was reached without success
    */
    function timeOutProcess() public returns(bool){
        if ((status == Status.PROCESS_ACTIVE)  && (processDueTime < block.timestamp)){
            emit TimeOutProcess(block.timestamp); 
            status = Status.PROCESS_FAILURE;
            return true;
        }
        return false;
    }

    /**
    * @notice check if minimal pledge amount was not reached within the predefined time
    */
    function timeOutMinPledge() public returns(bool){
        if ((status == Status.PROCESS_ACTIVE) && minPledgeDueTime < block.timestamp && totalPledge < minPledge){
            emit TimeOutMinPledge(block.timestamp, totalPledge); 
            status = Status.PROCESS_FAILURE;
            return true;
        }
        return false;
    }
}
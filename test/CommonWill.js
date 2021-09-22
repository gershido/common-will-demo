const CommonWill = artifacts.require('CommonWill');
const CommonWillFactory = artifacts.require('CommonWillFactory');
const PledgeToken = artifacts.require("PledgeToken");
const timeMachine = require('ganache-time-traveler');
const BN = require('bn.js');

contract('Common Good Process', addresses => {
    const [executor, judge, supporter1, supporter2, admin, _] = addresses;
    const SECONDS_IN_DAY = 86400;
    const conditionDataId = "0x0000000000000000000000000000000000000000000000000000000000000123";
    const minPledge = 15000;
    const minPledgeTimeDuration = 10 *SECONDS_IN_DAY;
    const processTimeDuration = 100 * SECONDS_IN_DAY;
    const PLEDGE_TOKENS_AMOUNT = 1000000;

    it('Test1', async () => {
        // check current time and calc process schedule
        let blockNum = await web3.eth.getBlockNumber();
        let block = await web3.eth.getBlock(blockNum);
        let currentTime = block.timestamp;
        //console.log(new Date(currentTime*1000).toUTCString());
        let processDueTime = currentTime + processTimeDuration;
        let minPledgeDueTime = currentTime + minPledgeTimeDuration;

        // deploy contracts and check hashing results compatible
        const pledgeToken = await PledgeToken.new(PLEDGE_TOKENS_AMOUNT, admin);
        const factory = await CommonWillFactory.deployed();
        const createCgResult = await factory.createCommonWill(judge, conditionDataId, processDueTime,
          minPledge, minPledgeDueTime, pledgeToken.address);
        const cgAddress = await createCgResult.logs[0].args.newCommonWill;
        const cgProcess = await CommonWill.at(cgAddress);
       
        
        // transfer supporters pledge tokens
        await pledgeToken.transfer(
            supporter1, 
            10000, 
            {from: admin}
        );
        await pledgeToken.transfer(
            supporter2, 
            20000, 
            {from: admin}
        );
        let supporter1Balance = await pledgeToken.balanceOf(
            supporter1,
            {from: admin}
        );
        let supporter2Balance = await pledgeToken.balanceOf(
            supporter2,
            {from: admin}
        );
        assert(supporter1Balance.toString() == '10000');
        assert(supporter2Balance.toString() == '20000');

        
        // supporter1 pledge
        await pledgeToken.approve(cgProcess.address, 10000, {from: supporter1});
        await cgProcess.pledge(10000, {from: supporter1});
        let supporter1Pledge = await cgProcess.pledges(supporter1);
        assert(supporter1Pledge == 10000);
        
        //try withraw too early
        try {
            await cgProcess.withrawPledge({from: supporter1});
        } catch(err){
            //console.log(err);
        };
        supporter1Pledge = await cgProcess.pledges(supporter1);
        assert(supporter1Pledge == 10000);

        // timeout min pledge
        await timeMachine.advanceTimeAndBlock(11 * SECONDS_IN_DAY);
        await cgProcess.withrawPledge({from: supporter1});
        supporter1Balance = await pledgeToken.balanceOf(supporter1,{from: admin});
        supporter1Pledge = await cgProcess.pledges(supporter1);
        assert(supporter1Pledge == 0);
        assert(supporter1Balance.toString() == '10000');
        
        //try judge after timeout
        try {
            await cgProcess.judgeSuccess(executor, {from: judge});
            throw 'judge after timeout min pledge';
        } catch(err){
            //console.log(err);
        };
    });

    
    it('Test2', async () => {
         // check current time and calc process schedule
         let blockNum = await web3.eth.getBlockNumber();
         let block = await web3.eth.getBlock(blockNum);
         let currentTime = block.timestamp;
         //console.log(new Date(currentTime*1000).toUTCString());
         let processDueTime = currentTime + processTimeDuration;
         let minPledgeDueTime = currentTime + minPledgeTimeDuration;
 
         // deploy contracts and check hashing results compatible
         const pledgeToken = await PledgeToken.new(PLEDGE_TOKENS_AMOUNT, admin);
         const factory = await CommonWillFactory.deployed();
         const createCgResult = await factory.createCommonWill(judge, conditionDataId, processDueTime,
           minPledge, minPledgeDueTime, pledgeToken.address);
         const cgAddress = await createCgResult.logs[0].args.newCommonWill;
         const cgProcess = await CommonWill.at(cgAddress);
    
        // transfer supporters pledge tokens
        await pledgeToken.transfer(
          supporter1, 
          10000, 
          {from: admin}
        );
        await pledgeToken.transfer(
            supporter2, 
            20000, 
            {from: admin}
        );
        let supporter1Balance = await pledgeToken.balanceOf(
            supporter1,
            {from: admin}
        );
        let supporter2Balance = await pledgeToken.balanceOf(
            supporter2,
            {from: admin}
        );
        assert(supporter1Balance.toString() == '10000');
        assert(supporter2Balance.toString() == '20000');

        // supporter1 pledge
        await pledgeToken.approve(cgProcess.address, 10000, {from: supporter1});
        await cgProcess.pledge(10000, {from: supporter1});
        let supporter1Pledge = await cgProcess.pledges(supporter1);
        assert(supporter1Pledge == 10000);
        
        // supporter2 pledge
        await pledgeToken.approve(cgProcess.address, 20000, {from: supporter2});
        await cgProcess.pledge(20000, {from: supporter2});
        let supporter2Pledge = await cgProcess.pledges(supporter2);
        assert(supporter2Pledge == 20000);
      
        // advance time after execution time
        await timeMachine.advanceTimeAndBlock(120 * SECONDS_IN_DAY);

        //try judge after timeout
        try {
            await cgProcess.judgeSuccess(executor, {from: judge});
            throw 'judge after timeout min pledge';
        } catch(err){
            //console.log(err);
        };

        // supporter1 withraw
        await cgProcess.withrawPledge({from: supporter1});
        supporter1Balance = await pledgeToken.balanceOf(supporter1,{from: admin});
        supporter1Pledge = await cgProcess.pledges(supporter1);
        assert(supporter1Pledge == 0);
        assert(supporter1Balance.toString() == '10000');
    });

    
    it('Test3', async () => {
        // check current time and calc process schedule
        let blockNum = await web3.eth.getBlockNumber();
        let block = await web3.eth.getBlock(blockNum);
        let currentTime = block.timestamp;
        //console.log(new Date(currentTime*1000).toUTCString());
        let processDueTime = currentTime + processTimeDuration;
        let minPledgeDueTime = currentTime + minPledgeTimeDuration;

        // deploy contracts and check hashing results compatible
        const pledgeToken = await PledgeToken.new(PLEDGE_TOKENS_AMOUNT, admin);
        const factory = await CommonWillFactory.deployed();
        const createCgResult = await factory.createCommonWill(judge, conditionDataId, processDueTime,
          minPledge, minPledgeDueTime, pledgeToken.address);
        const cgAddress = await createCgResult.logs[0].args.newCommonWill;
        const cgProcess = await CommonWill.at(cgAddress);
   
       // transfer supporters pledge tokens
       await pledgeToken.transfer(
         supporter1, 
         10000, 
         {from: admin}
       );
       await pledgeToken.transfer(
           supporter2, 
           20000, 
           {from: admin}
       );
       let supporter1Balance = await pledgeToken.balanceOf(
           supporter1,
           {from: admin}
       );
       let supporter2Balance = await pledgeToken.balanceOf(
           supporter2,
           {from: admin}
       );
       assert(supporter1Balance.toString() == '10000');
       assert(supporter2Balance.toString() == '20000');

       // supporter1 pledge
       await pledgeToken.approve(cgProcess.address, 10000, {from: supporter1});
       await cgProcess.pledge(10000, {from: supporter1});
       let supporter1Pledge = await cgProcess.pledges(supporter1);
       assert(supporter1Pledge == 10000);
       
       // supporter2 pledge
       await pledgeToken.approve(cgProcess.address, 20000, {from: supporter2});
       await cgProcess.pledge(20000, {from: supporter2});
       let supporter2Pledge = await cgProcess.pledges(supporter2);
       assert(supporter2Pledge == 20000);
        
        // advance time after min pledge time
        await timeMachine.advanceTimeAndBlock(11 * SECONDS_IN_DAY);

        //judge succcess
        await cgProcess.judgeSuccess(executor, {from: judge});

        //try withraw 
        try {
            await cgProcess.withrawPledge({from: supporter1});
            throw 'withraw after judge success';
        } catch(err){
            //console.log(err);
        };
        supporter1Pledge = await cgProcess.pledges(supporter1);
        assert(supporter1Pledge == 10000);
        
        let executorBalance = await pledgeToken.balanceOf(
            executor,
            {from: admin}
        );
        assert(executorBalance.toString() == '30000');
    });
    
});
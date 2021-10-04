/* eslint-disable no-console */
const CommonWill = artifacts.require('CommonWill');
const CommonWillFactory = artifacts.require('CommonWillFactory');
const PledgeToken = artifacts.require('PledgeToken');

module.exports = async function(deployer, network, accounts) {
    console.log('🚀 ~ network, accounts', network, accounts);

    // Deploy logic/implementation contracts
    await deployer.deploy(CommonWill);
    const commonWill = await CommonWill.deployed();
    console.log('🚀 ~ Common Will Master Contract Address', commonWill.address);

    // Deploy logic/implementation contracts
    await deployer.deploy(PledgeToken, '1000000000000000000000000', accounts[0]);
    const pledgeToken = await PledgeToken.deployed();
    console.log('🚀 ~ Pledge Token Contract Address', pledgeToken.address);

    // Deploy factory
    await deployer.deploy(CommonWillFactory, commonWill.address);
    const commonWillFactory = await CommonWillFactory.deployed();
    console.log('🚀 ~ Common Will Factory Contract Address', commonWillFactory.address);

    const SECONDS_IN_DAY = 86400;
    const conditionDataId = "0x0000000000000000000000000000000000000000000000000000000000000123";
    const minPledge = '15000000000000000000000';
    const minPledgeTimeDuration = 10 * SECONDS_IN_DAY;
    const processTimeDuration = 100 * SECONDS_IN_DAY;

    // check current time and calc process schedule
    let blockNum = await web3.eth.getBlockNumber();
    let block = await web3.eth.getBlock(blockNum);
    let currentTime = block.timestamp;
    //console.log(new Date(currentTime*1000).toUTCString());
    let processDueTime = currentTime + processTimeDuration;
    let minPledgeDueTime = currentTime + minPledgeTimeDuration;

    // deploy contracts and check hashing results compatible
    const createCwResult = await commonWillFactory.createCommonWill(accounts[1], conditionDataId, processDueTime,
      minPledge, minPledgeDueTime, pledgeToken.address);
    const cwAddress = await createCwResult.logs[0].args.newCommonWill;
    console.log('🚀 ~ Common Will Proxy Contract Address', cwAddress);

    let proxyContract = await CommonWill.at(cwAddress);
    await pledgeToken.approve(cwAddress, '10000000000000000000'); 
    await proxyContract.pledge('10000000000000000000', {from: accounts[0]});
    console.log('🚀 ~ Pledged!');
    let totalPledge = await proxyContract.totalPledge();
    console.log('🚀 ~ Totala pledge:', totalPledge.toString());
}

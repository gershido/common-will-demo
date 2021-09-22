/* eslint-disable no-console */
const CommonWill = artifacts.require('CommonWill');
const CommonWillFactory = artifacts.require('CommonWillFactory');

module.exports = async function(deployer, network, accounts) {
    console.log('🚀 ~ network, accounts', network, accounts);

    // Deploy logic/implementation contracts
    await deployer.deploy(CommonWill);
    const commonWill = await CommonWill.deployed();
    console.log('🚀 ~ Common Will Contract Address', commonWill.address);

    // Deploy factory
    await deployer.deploy(CommonWillFactory, commonWill.address);
    const commonWillFactory = await CommonWillFactory.deployed();
    console.log('🚀 ~ Common Will Factory Contract Address', commonWillFactory.address);
}

import { ethers, Contract, BigNumber } from 'ethers';
import CommonWillFactory from '../contracts/CommonWillFactory.json';
import CommonWill from '../contracts/CommonWill.json';
import PledgeToken from '../contracts/PledgeToken.json';
import {useWeb3Context} from '../context/Web3Context';
import {useContractDataContext} from '../context/ContractDataContext';
import 'bn.js';

//const web3Context = useWeb3Context();
//const signer: ethers.providers.JsonRpcSigner = web3Context.state.signer as ethers.providers.JsonRpcSigner;
//const account = web3Context.state.account;

const PROXY_ADDRESS = '0xA6Bda1b9Bb44685CD1640758c038e17D52Ceeb33';
const PLEDGE_TOKEN_ADDRESS = '0x9eDBfeE8a2df00096431738387a8BA4Cb9cbD865';

//const proxy = new Contract(
//    '0xA6Bda1b9Bb44685CD1640758c038e17D52Ceeb33',
//    CommonWill.abi,
//    signer
//);
//
//const pledgeToken = new Contract(
//    '0x9eDBfeE8a2df00096431738387a8BA4Cb9cbD865',
//    PledgeToken.abi,
//    signer
//);


export const getContractAddress = () : string => {
    return PROXY_ADDRESS;
}


export const getMyPledge = async (proxy: Contract, account: string) : Promise<BigNumber | undefined> => {
    try{
      let currentPledgeBig = await proxy.pledges(account);
      let currentPledgeAmount = BigNumber.from(currentPledgeBig);
      currentPledgeAmount = currentPledgeAmount.div(BigNumber.from('1000000000000000000'));
      return currentPledgeAmount;
    } catch(err){
      console.log(err);
    }
}


export const getTotalPledge = async (proxy: Contract) : Promise<BigNumber | undefined> =>{
    try{
      let totalPledgeTemp = await proxy.totalPledge();
      totalPledgeTemp = BigNumber.from(totalPledgeTemp);
      let totalPledge = totalPledgeTemp.div(BigNumber.from('1000000000000000000'));
      return totalPledge;
    } catch(err){
      console.log(err);
    }
};

export const getMinPledge = async (proxy: Contract) : Promise<BigNumber | undefined> => {
    try{
      let minPledgeTemp = await proxy.minPledge();
      minPledgeTemp = BigNumber.from(minPledgeTemp);
      let minPledge = minPledgeTemp.div(BigNumber.from('1000000000000000000'));
      return minPledge;
    } catch(err){
      console.log(err);
    }
}


export const getMinPledgeTime = async (proxy: Contract) : Promise<string | undefined> => {
    try{
      let minPledgeTimeTemp = await proxy.minPledgeDueTime();
      let minPledgeTime = new Date(minPledgeTimeTemp*1000).toUTCString();
      return minPledgeTime;
    } catch(err){
      console.log(err);
    }
}

export const getTotalTime = async (proxy: Contract) : Promise<string | undefined> => {
    try{
      let totalTimeTemp = await proxy.processDueTime();
      let totalTime = new Date(totalTimeTemp*1000).toUTCString();
      return totalTime;
    } catch(err){
      console.log(err);
    }
}


export const getJudge = async (proxy: Contract) : Promise<string | undefined> => {
    try{
      let judge = await proxy.judge();
      return judge;
    } catch(err){
      console.log(err);
    }
}


//const support = async (e) => {
//  e.preventDefault();
//  const amount = BigNumber.from(e.target.elements[0].value + '000000000000000000');
//  const currentAddress = await signer.getAddress();
//  let approve = await pledgeToken.approve(proxy.address, amount.toString());
//  await approve.wait();
//  try{
//    let txPledge = await proxy.pledge(amount);
//    let receiptPledge = await txPledge.wait();
//  } catch(err){
//    console.log(err);
//  }
//  let currentPledgeBig = await proxy.pledges(currentAddress);
//  let currentPledgeAmount = BigNumber.from(currentPledgeBig);
//  currentPledgeAmount = currentPledgeAmount.div(BigNumber.from('1000000000000000000'));
//  setPledgeAmount(currentPledgeAmount.toString());
//};
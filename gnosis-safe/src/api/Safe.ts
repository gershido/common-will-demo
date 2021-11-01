import Safe, { SafeFactory, SafeAccountConfig, EthersAdapter } from '@gnosis.pm/safe-core-sdk';
//import  SafeTransactionDataPartial  from '@gnosis.pm/safe-core-sdk';
//import {SafeTransactionDataPartial} from '@gnosis.pm/safe-core-sdk';
import { SafeTransaction } from "@gnosis.pm/safe-core-sdk-types";
import { BigNumber, utils } from 'ethers';

export async function deployNewSafe(ethersAdapter : EthersAdapter, owners: string[], threshold: number) : Promise<Safe>{
    const safeFactory = await SafeFactory.create({ ethAdapter: ethersAdapter});
    const safeAccountConfig: SafeAccountConfig = { owners, threshold };
    const safeSdk: Safe = await safeFactory.deploySafe(safeAccountConfig);

    return safeSdk;
}

export async function connectExistingSafe(ethersAdapter : EthersAdapter, safeAddress: string){
    const safeSdk: Safe = await Safe.create({ ethAdapter: ethersAdapter, safeAddress });
    
    return safeSdk;
}

export async function getSafeDetails(safeSdk: Safe){
    const owners = await safeSdk.getOwners();
    const threshold = await safeSdk.getThreshold();
    const address = await safeSdk.getAddress();
    const balanceWei = await safeSdk.getBalance();
    const balanceEther = balanceWei.mul('1000').div(BigNumber.from('1000000000000000000'));
    const balanceEtherFormatted = utils.formatUnits(balanceEther, 3);

    return {address, owners, threshold, balanceEtherFormatted};
}

export async function createTransaction(safeSdk: Safe, to: string, value: string, data: string){
    let valueWei = utils.parseEther(value).toString();
    const safeTransactions= [{
        to: to,
        value: valueWei.toString(),
        data: data
    }];
    let safeTransaction = null;
    try{
        safeTransaction = await safeSdk.createTransaction(...safeTransactions);
    } catch(err){
        console.log("catched error:", err);
    }

    return safeTransaction;
}

export async function getOwnersApproved(safeSdk: Safe, transaction: SafeTransaction){
    const txHash = await safeSdk.getTransactionHash(transaction);
    const owners = await safeSdk.getOwnersWhoApprovedTx(txHash);

    return owners;
}

export async function approveTransaction(safeSdk: Safe, transaction: SafeTransaction){
    const signature = await safeSdk.signTransaction(transaction);

    return signature;
}

export async function executeTransaction(safeSdk: Safe, transaction: SafeTransaction){
    const executeTxResponse = await safeSdk.executeTransaction(transaction)
    const receipt = await executeTxResponse.transactionResponse?.wait()

    return receipt;
}
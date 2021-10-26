import { ethers, Contract } from 'ethers';
import { EthersAdapter } from '@gnosis.pm/safe-core-sdk';

export async function getWeb3(){
    // @ts-ignore
    if (window.ethereum) {
        // @ts-ignore
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        // @ts-ignore
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = await provider.getSigner();
        const account = await signer.getAddress();
        const ethersAdapter = new EthersAdapter({ethers,signer});

        return {account, ethersAdapter, signer};
    }
    return undefined;
}


export async function onAccountChange(
    signer: ethers.providers.JsonRpcSigner | undefined,
    callback: (data: { account: string; signer?: ethers.providers.JsonRpcSigner | undefined }) => any){
        // @ts-ignore
        window.ethereum.on('accountsChanged', function (accounts){
            const newData : {account: string; signer: ethers.providers.JsonRpcSigner | undefined} = {account: accounts[0], signer};
            callback(newData);
        });
    }
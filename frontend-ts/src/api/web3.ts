import { ethers, Contract } from 'ethers';
import { stringify } from 'querystring';
//import CommonWillFactory from '../contracts/CommonWillFactory.json';
//import CommonWill from '../contracts/CommonWill.json';
//import PledgeToken from '../contracts/PledgeToken.json';



export async function getWeb3(){
    // @ts-ignore
    if (window.ethereum) {
        // @ts-ignore
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        // @ts-ignore
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = await provider.getSigner();
        const account = await signer.getAddress();
        //const pledgeToken = new Contract(
        //    '0xA6Bda1b9Bb44685CD1640758c038e17D52Ceeb33',
        //    PledgeToken.abi,
        //  signer
        //);
        //const proxy = new Contract(
        //    '0xA6Bda1b9Bb44685CD1640758c038e17D52Ceeb33',
        //    CommonWill.abi,
        //  signer
        //);

        return {account, signer};
    }
    return undefined;
}


export async function onAccountChange(
    signer: ethers.providers.JsonRpcSigner | null,
    callback: (data: { account: string; signer?: ethers.providers.JsonRpcSigner | null }) => any){
        // @ts-ignore
        window.ethereum.on('accountsChanged', function (accounts){
            const newData : {account: string; signer: ethers.providers.JsonRpcSigner | null} = {account: accounts[0], signer};
            callback(newData);
        });
    }
import React, {useEffect, useState} from "react";
import {Contract, BigNumber} from 'ethers';
import {useContractDataContext} from '../context/ContractDataContext';
import { useWeb3Context } from "../context/Web3Context";
import {getTotalPledge, getMyPledge, getMinPledgeTime, getMinPledge, getJudge, getContractAddress, getTotalTime} from '../api/ContractData';
import CommonWill from '../contracts/CommonWill.json';
import PledgeToken from '../contracts/PledgeToken.json';

export function ContractDetails(){
    let contractDataContext = useContractDataContext();
    let totalPledge = contractDataContext.state.totalPledge;
    let minimaPledge = contractDataContext.state.minimalPledge;
    let myPledge = contractDataContext.state.myPledge;
    let winner = contractDataContext.state.winner;
    let minimalPledgeTime = contractDataContext.state.minimalPledgeTime;
    let totalTime = contractDataContext.state.totalTime;
    let judge = contractDataContext.state.judge;
    let updateMyPledge = contractDataContext.updateMyPledge;
    let updateTotalPledge = contractDataContext.updateTotalPledge;
    let updateAll = contractDataContext.updateAll;

    const web3Context = useWeb3Context();
    const signer = web3Context.state.signer;
    const account = web3Context.state.account;

    const PROXY_ADDRESS = '0xA6Bda1b9Bb44685CD1640758c038e17D52Ceeb33';
    const PLEDGE_TOKEN_ADDRESS = '0x9eDBfeE8a2df00096431738387a8BA4Cb9cbD865';

    const [proxy, setProxy] = useState<Contract>(() => {
        const proxyTemp = new Contract(
            '0xA6Bda1b9Bb44685CD1640758c038e17D52Ceeb33',
            CommonWill.abi,
            signer
        );
        return proxyTemp;
    });
    const [pledgeToken, setPledgeToken] = useState<Contract>(() => {
        const pledgeTokenTemp = new Contract(
            '0x9eDBfeE8a2df00096431738387a8BA4Cb9cbD865',
            PledgeToken.abi,
            signer
        );
        return pledgeTokenTemp;
    });


    useEffect(() => {
        const initDetails = async () => {
            let myPledgeInit = await getMyPledge(proxy, account);
            let totalPledgeInit = await getTotalPledge(proxy,);
            let minimalPledgeInit = await getMinPledge(proxy);
            let MinPledgeTimeInit = await getMinPledgeTime(proxy);
            let judgeInit = await getJudge(proxy);
            let totalTimeInit = await getTotalTime(proxy);

            updateAll(
                totalPledgeInit,
                myPledgeInit,
                judgeInit,
                minimalPledgeInit,
                MinPledgeTimeInit,
                totalTimeInit,
                winner,
            );
        }

        initDetails();
    }, [signer, account]);

    useEffect(() => {
        const listenEvents = () => {
            proxy.on("Pledge", async (from, amount, event) => {
              if (from == account){
                let myPledgeCurrent = await getMyPledge(proxy, account);
                let totalPledgeCurrent = await getTotalPledge(proxy);
                updateMyPledge(myPledgeCurrent, totalPledgeCurrent);
              }
              else{
                let totalPledgeCurrent = await getTotalPledge(proxy);
                updateTotalPledge(totalPledgeCurrent);
              } 
              console.log("Pledged!", amount.toString(), from);
            });
        };
        listenEvents();
    }, [signer]);

    return (
        <div>
            <h2  className="mb-2">
                Contract Details
            </h2>
            <div className="mb-1">
                Contract address: {PROXY_ADDRESS}
            </div>
            <div className="mb-1">
                My pledge: {myPledge ? myPledge.toString() : ''}
            </div>
            <div className="mb-1">
                Total pledge: {totalPledge ? totalPledge.toString() : ''}
            </div>
            <div className="mb-4">
                Winner: {winner ? winner : ''}
            </div>
            <div className="mb-1">
                Minimal Pledge required: {minimaPledge ? minimaPledge.toString() : ''}
            </div>
            <div className="mb-1">
                Due Time for minimal Pledge: {minimalPledgeTime ? minimalPledgeTime : ''}
            </div>
            <div className="mb-4">
                Due time total process: {totalTime ? totalTime : ''}
            </div>
        </div>
    );
}

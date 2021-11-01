import React, {useState, useEffect} from "react";
import { SafeTransaction } from "@gnosis.pm/safe-core-sdk-types";
import Safe from "@gnosis.pm/safe-core-sdk";
import {useSafeContext} from '../context/SafeContext';
import {useWeb3Context} from '../context/Web3Context';
import Button from 'react-bootstrap/Button';
import {approveTransaction, executeTransaction} from '../api/Safe';
import { BigNumber, utils } from "ethers";

interface TransactionProps{
    transaction: SafeTransaction,
    owners: string[],
    threshold: number
}

export const Transaction: React.FC<TransactionProps> = ({transaction, owners, threshold}) => {
    let safeContext = useSafeContext();
    let safe = safeContext.state.safe as Safe;
    
    let web3Context = useWeb3Context();
    let currentAccount = web3Context.state.account;
    
    const [transactionStatus, setTransactionStatus] = useState('pending');
    const [ownersApproved, setOwnersApproved] = useState<string[]>([]);
    const [canApprove, setCanApprove] = useState(() => {
        let isOwner : boolean = owners.map((val) => val.toLowerCase()).includes(currentAccount.toLowerCase());
        let alreadyApproved : boolean = ownersApproved.map((val) => val.toLowerCase()).includes(currentAccount.toLowerCase());
        if (isOwner && !alreadyApproved && transactionStatus != 'executed'){
            return true;
        }
        else{
            return false;
        }
    });
    const [canExecute, setCanExecute] = useState(false);

    
    useEffect(() => {
        let isOwner : boolean = owners.map((val) => val.toLowerCase()).includes(currentAccount.toLowerCase());
        let alreadyApproved : boolean = ownersApproved.map((val) => val.toLowerCase()).includes(currentAccount.toLowerCase());
        if (isOwner && !alreadyApproved && transactionStatus != 'executed'){
            setCanApprove(true);
        }
        else{
            setCanApprove(false);
        }
    }, [transactionStatus, currentAccount, ownersApproved]);


    const handleApprove = async (e : any) => {
        e.preventDefault();
        let signature = await approveTransaction(safe, transaction);
        let numOwnersApproved = ownersApproved.length + 1;
        setOwnersApproved([...ownersApproved, currentAccount]);
        if (numOwnersApproved >= threshold){
            setTransactionStatus('approved');
            setCanExecute(true);
        }
    }

    const handleExecute = async (e : any) => {
        e.preventDefault();
        let receipt = await executeTransaction(safe, transaction);
        setTransactionStatus('executed');
        setCanExecute(false);
        setCanApprove(false);
    }

    const getValueFormatted = (val: string) => {
        let formattedValTemp = BigNumber.from(val).mul('1000').div(BigNumber.from('1000000000000000000'));
        let formattedVal = utils.formatUnits(formattedValTemp, 3);
        return formattedVal.toString();
    }

    return (
        <div>
            <div>status: {transactionStatus}</div>
            <div>to: {transaction.data.to}</div>
            <div>value: {getValueFormatted(transaction.data.value)}</div>
            <div>data: {transaction.data.data}</div>
            <div>Owners Approved:</div>
            <ul>
                {ownersApproved.map((owner) =>
                <li key={owner}>{owner}</li>)}
            </ul>
            <Button variant="primary" disabled={!canApprove} onClick={e => {handleApprove(e)}}>
                Approve (off-chain)
            </Button>
            <Button variant="primary" disabled={!canExecute} onClick={e => {handleExecute(e)}}>
                Execute
            </Button>
        </div>
    );
}
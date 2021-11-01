import React, {useState, useEffect} from "react";
import { SafeTransaction } from "@gnosis.pm/safe-core-sdk-types";
import Safe from "@gnosis.pm/safe-core-sdk";
import {useSafeContext} from '../context/SafeContext';
import {useWeb3Context} from '../context/Web3Context';
import { getSafeDetails } from "../api/Safe";
import { CreateTransaction } from "./CreateTransaction";
import { Transaction } from "./Transaction";


export function Transactions(){
    const [transactions, setTransactions] = useState<SafeTransaction[]>([]);
    const [owners, setOwners] = useState<string[]>([]);
    const [threshold, setThreshold] = useState(0);

    let safeContext = useSafeContext();
    let safe = safeContext.state.safe as Safe;
    
    let web3Context = useWeb3Context();
    let currentAccount = web3Context.state.account;

    useEffect(() => {
        const init = async () => {
            let safeDetails = await getSafeDetails(safe);
            setOwners(safeDetails.owners);
            setThreshold(safeDetails.threshold);
        }
        init();
    }, [safe]);

    const addTransaction = (transaction: SafeTransaction) => {
        setTransactions((prev) => [...prev, transaction]);
    }

    let transactionList = transactions.map((tx, index) => 
        <li key={index}>
            <Transaction transaction={tx} owners={owners} threshold={threshold}/>
        </li>)

    return(
        <div>
            <h2>Transactions:</h2>
            <div className="mb-4">
                <CreateTransaction addTransaction={addTransaction} owners={owners}/>
            </div>
            <div style={{fontWeight: 'bold'}}>Existing Transactions:</div>
            <ul>
                {transactionList}
            </ul>
        </div>
    );

}   

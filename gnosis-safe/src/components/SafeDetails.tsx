import React, {useState, useEffect} from "react";
import {useSafeContext} from "../context/SafeContext";
import { getSafeDetails } from "../api/Safe";
import Safe from "@gnosis.pm/safe-core-sdk";

export function ContractDetails(){
    const [safeAdress, setSafeAddress] = useState('');
    const [owners, setOwners] = useState(['']);
    const [threshold, setThreshold] = useState(0);
    const [balance, setBalance] = useState('');

    let safeContext = useSafeContext();
    let safeSdk = safeContext.state.safe as Safe;

    useEffect(() => {
        const get = async () => {
            let safeDetails = await getSafeDetails(safeSdk);
            setSafeAddress(safeDetails.address);
            setOwners(safeDetails.owners);
            setThreshold(safeDetails.threshold);
            setBalance(safeDetails.balance.toString());
        }
        get();
    }, [safeSdk]);

    console.log(owners);

    let OwnersList = owners.map((val) =>
        <li key={val.toString()}>
            {val}
        </li>
    );

    return(
        <div>
            <h2>Safe Details:</h2>
            <div>address: {safeAdress}</div>
            <div>
                Owners:
                <ul>
                    {OwnersList}
                </ul>
            </div>
            <div>threshold: {threshold}</div>
            <div>balance: {balance}</div>
        </div>
    );



}
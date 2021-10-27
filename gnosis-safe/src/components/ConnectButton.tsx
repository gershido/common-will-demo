import React, {useState, useEffect} from 'react';
import {Button} from 'react-bootstrap';
import {useWeb3Context} from '../context/Web3Context';
import {getWeb3, onAccountChange} from '../api/Web3';

export default function ConnectButton(){
    const web3Context = useWeb3Context();
    const signer = web3Context.state.signer;
    const account = web3Context.state.account;
    const updateAccount = web3Context.updateAccount;

    const [state, setState] = useState("Connect");


    const onClickConnect = async () => {
        setState("Connecting...")
        let data = await getWeb3();
        console.log(data?.ethersAdapter);

        if (data){
          updateAccount(data);
          onAccountChange(signer, updateAccount);
        }
        setState("Conncted");
    }

    return(
        <div>
            <Button 
                variant="primary"
                disabled={state != "Connect"}
                onClick={onClickConnect}
            >
                {state}
            </Button>
            <div>
                account: {account}
            </div>        
        </div>
    );
}
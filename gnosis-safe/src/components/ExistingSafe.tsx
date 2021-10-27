import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import ethers from 'ethers';
import { useWeb3Context } from '../context/Web3Context';
import {connectExistingSafe} from '../api/Safe';
import { EthersAdapter } from '@gnosis.pm/safe-core-sdk';
import {useSafeContext} from '../context/SafeContext';


export function ExistingSafe(){
    const [formValue, setFormValue] = useState('');
    const [disabled, setDisabled] = useState(false);

    const web3Context = useWeb3Context();
    const signer = web3Context.state.signer as ethers.providers.JsonRpcSigner;
    const account = web3Context.state.account;
    const ethersAdapter = web3Context.state.ethersAdapter as EthersAdapter;;

    const safeContext = useSafeContext();
    const updateSafe = safeContext.updateSafe; 

    const handleSubmit = async (e : any) => {
        e.preventDefault();
        setDisabled(true);

        let newSafe = await connectExistingSafe(ethersAdapter, e.target.elements[1].value);
        updateSafe(newSafe);
    }


    const handleChangeOwners = (e : any) => {
        setFormValue(e.target.value);
    } 
    
    return(
        <>
            <Form onSubmit={e => {handleSubmit(e)}}>
                <fieldset disabled={disabled}>
                    <Form.Group className="mb-3">
                        <Form.Label>
                            Contract address:
                        </Form.Label>
                        <Form.Control type="text" onChange={e => {handleChangeOwners(e)}} value={formValue}></Form.Control>
                    </Form.Group>
                    <Button variant="primary" type="submit"> 
                        Create
                    </Button>
                </fieldset>
            </Form>
        </>
    );
}


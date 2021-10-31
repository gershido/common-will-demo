import React, { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import ethers, { BigNumber, Contract } from 'ethers';
import { useWeb3Context } from '../context/Web3Context';
import {deployNewSafe} from '../api/Safe';
import { EthersAdapter } from '@gnosis.pm/safe-core-sdk';
import {useSafeContext} from '../context/SafeContext';


export function CreateSafe(){
    const [numOwners, setNumOwners] = useState(0);
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

        let owners: string[] = new Array();
        let startIndex: number = 2;
        let endIndex: number = startIndex + +numOwners;

        for (let i = 2; i < endIndex; i++){
            owners.push(e.target.elements[i].value);
        }
        let threshold = e.target.elements[endIndex].value;

        let newSafe = await deployNewSafe(ethersAdapter, owners, threshold);
        updateSafe(newSafe);
        
    }


    const handleChangeOwners = (e : any) => {
        setFormValue(e.target.value);
        setNumOwners(e.target.value);
    } 

    let tempArr : number[];
    let ownerInputs = null; 

    tempArr = new Array();
    for (let i = 0; i < numOwners; i++){
        tempArr.push(i);
    }

    ownerInputs = tempArr.map((val) =>
        <div key={val}>
            <Form.Group className="mb-3">
                <Form.Label>
                    Owner number {val}:
                </Form.Label>
                <Form.Control type="text"></Form.Control>
            </Form.Group>
        </div>
    );
    
    return(
        <>
            <Form onSubmit={e => {handleSubmit(e)}}>
                <fieldset disabled={disabled}>
                    <Form.Group className="mb-3">
                        <Form.Label>
                            Number of owners:
                        </Form.Label>
                        <Form.Control type="number" onChange={e => {handleChangeOwners(e)}} value={formValue}></Form.Control>
                    </Form.Group>
                    {ownerInputs}
                    <Form.Group className="mb-3">
                        <Form.Label>
                            Threshold:
                        </Form.Label>
                        <Form.Control type="number"></Form.Control>
                    </Form.Group>
                    <Button variant="primary" type="submit"> 
                        Create
                    </Button>
                </fieldset>
                
            </Form>
        </>
    );
}


import React, { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import ethers, { BigNumber, Contract } from 'ethers';
import { useWeb3Context } from '../context/Web3Context';

const OwnerInput: React.FC<{num: number}> = (num) => {
    return(
        <Form.Group className="mb-3">
            <Form.Label>
                Owner number {num}:
            </Form.Label>
            <Form.Control type="number"></Form.Control>
        </Form.Group>
    );
}

export function CreateSafe(){
    const [numOwners, setNumOwners] = useState(0);
    const [formValue, setFormValue] = useState('');

    const web3Context = useWeb3Context();
    const signer = web3Context.state.signer as ethers.providers.JsonRpcSigner;
    const account = web3Context.state.account;

    const handleSubmit = async (e : any) => {
        e.preventDefault();
        console.log(e.target.elements[1].value);
        console.log(e.target.elements[2].value);
        
        setFormValue('');
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
                <Form.Control type="number"></Form.Control>
            </Form.Group>
        </div>
    );
    
    return(
        <>
            <Form onSubmit={e => {handleSubmit(e)}}>
                <Form.Group className="mb-3">
                    <Form.Label>
                        Number of owners:
                    </Form.Label>
                    <Form.Control type="number" onChange={e => {handleChangeOwners(e)}} value={formValue}></Form.Control>
                </Form.Group>
                {ownerInputs}
                <Button variant="primary" type="submit"> 
                    Create
                </Button>
            </Form>
        </>
    );
}


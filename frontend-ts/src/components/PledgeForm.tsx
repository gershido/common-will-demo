import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import ethers, { BigNumber, Contract } from 'ethers';
import CommonWill from '../contracts/CommonWill.json';
import PledgeToken from '../contracts/PledgeToken.json';
import { useWeb3Context } from '../context/Web3Context';

const PROXY_ADDRESS = '0xA6Bda1b9Bb44685CD1640758c038e17D52Ceeb33';
const PLEDGE_TOKEN_ADDRESS = '0x9eDBfeE8a2df00096431738387a8BA4Cb9cbD865';

export function PledgeForm(){
    const [formValue, setFormValue] = useState('');
    const [showModal, setShowModal] = useState(false);

    const web3Context = useWeb3Context();
    const signer = web3Context.state.signer as ethers.providers.JsonRpcSigner;
    const account = web3Context.state.account;

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

    const handleSubmit = async (e : any) => {
        e.preventDefault();
        const amount = BigNumber.from(e.target.elements[0].value + '000000000000000000');
        const currentAddress = await signer.getAddress();
        let approve = await pledgeToken.approve(proxy.address, amount.toString());
        await approve.wait();
        try{
          let txPledge = await proxy.pledge(amount);
          let receiptPledge = await txPledge.wait();
        } catch(err){
          console.log(err);
        }
        setFormValue('');
        setShowModal(true);

    }


    const handleChange = (e : any) => {
        setFormValue(e.target.value);
    } 

    const closeModal = () => setShowModal(false);

    return(
        <>
            <Form onSubmit={e => {handleSubmit(e)}}>
                <Form.Group className="mb-3">
                    <Form.Label>
                        <div style={{fontWeight: "bold"}}>
                            Wanna pledge?
                        </div>
                    </Form.Label>
                    <Form.Control type="number" onChange={e => {handleChange(e)}} value={formValue}></Form.Control>
                </Form.Group>
                <Button variant="primary" type="submit"> 
                    Pledge
                </Button>
            </Form>
            <Modal show={showModal} onHide={closeModal}>
                <Modal.Body>Whooray!</Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={closeModal}>Close</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}


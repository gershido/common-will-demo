import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { BigNumber } from 'ethers';
import { useState } from 'react';

function PledgeForm(props){
    const [formValue, setFormValue] = useState('');
    const [showModal, setShowModal] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const amount = BigNumber.from(e.target.elements[0].value + '000000000000000000');
        const currentAddress = await props.signer.getAddress();
        let approve = await props.pledgeToken.approve(props.proxy.address, amount.toString());
        await approve.wait();
        try{
          let txPledge = await props.proxy.pledge(amount);
          let receiptPledge = await txPledge.wait();
        } catch(err){
          console.log(err);
        }
        setFormValue('');
        setShowModal(true);

    }

    const handleChange = (e) => {
        setFormValue(e.target.value);
    } 

    const closeModal = () => setShowModal(false);

    return(
        <>
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label>Wanna pledge?</Form.Label>
                    <Form.Control type="number" onChange={handleChange} value={formValue}></Form.Control>
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

export default PledgeForm;
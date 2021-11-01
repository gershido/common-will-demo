import React, {useState, useEffect} from "react";
import { SafeTransaction } from "@gnosis.pm/safe-core-sdk-types";
import Safe from "@gnosis.pm/safe-core-sdk";
import {useSafeContext} from '../context/SafeContext';
import {useWeb3Context} from '../context/Web3Context';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import {createTransaction} from '../api/Safe';


interface CreateTransactionProps{
    owners : string[],
    addTransaction: (transaction : SafeTransaction) => void,
}

export const CreateTransaction : React.FC<CreateTransactionProps>  = ({owners, addTransaction}) => {
    let safeContext = useSafeContext();
    let safe = safeContext.state.safe as Safe;
    
    let web3Context = useWeb3Context();
    let currentAccount = web3Context.state.account;
    
    const [disabled, setDisabled] = useState(() => {
        let ownersLowerCase = owners.map((val) => val.toLowerCase());
        let currentAccountLowerCase = currentAccount.toLowerCase();
        let isOwner : boolean = ownersLowerCase.includes(currentAccountLowerCase);
        if (isOwner){
            return false;
        }
        return true;
    });
    const [formValueTo, setFormValueTo] = useState('');
    const [formValueValue, setFormValueValue] = useState('');
    const [formValueData, setFormValueData] = useState('');
    
    const handleSubmit = async (e : any) => {
        e.preventDefault();
        let to: string = e.target.elements[1].value;
        let value: string = e.target.elements[2].value;
        let data: string = e.target.elements[3].value;

        let transaction : SafeTransaction | null = await createTransaction(safe, to, value, data);
        if (transaction)
            addTransaction(transaction);

        setFormValueTo('');
        setFormValueValue('');
        setFormValueData('');
    }

    const handleChangeTo = (e : any) => {
        setFormValueTo(e.target.value);
    } 

    const handleChangeValue = (e : any) => {
        setFormValueValue(e.target.value);
    }

    const handleChangeData = (e : any) => {
        setFormValueData(e.target.value);
    }

    useEffect(() => {
        let isOwner : boolean = owners.map((val) => val.toLowerCase()).includes(currentAccount.toLowerCase());
        if (isOwner){
            setDisabled(false);
        }

    }, [owners, currentAccount]);

    return(
        <div>
            <Form onSubmit={e => {handleSubmit(e)}}>
                <fieldset disabled={disabled}>
                    <div style={{fontWeight: 'bold'}}>Create Transaction</div>
                    <Form.Group className="mb-3">
                        <Form.Label>
                            to:
                        </Form.Label>
                        <Form.Control type="text" onChange={e => {handleChangeTo(e)}} value={formValueTo}></Form.Control>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>
                            value:
                        </Form.Label>
                        <Form.Control type="text" onChange={e => {handleChangeValue(e)}} value={formValueValue}></Form.Control>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>
                            data:
                        </Form.Label>
                        <Form.Control type="text" onChange={e => {handleChangeData(e)}} value={formValueData}></Form.Control>
                    </Form.Group>
                    <Button variant="primary" type="submit"> 
                        Create
                    </Button>
                </fieldset>
            </Form>
        </div>
    );
}
import React from 'react';
import './App.css';
import {useWeb3Context} from './context/Web3Context';
import {getWeb3 , onAccountChange} from './api/web3';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

function App() {
  const web3Context = useWeb3Context();
  const signer = web3Context.state.signer;
  const account = web3Context.state.account;
  const updateAccount = web3Context.updateAccount;



  const onClickConnect = async () => {
    let data = await getWeb3();

    if (data){
      updateAccount(data);
      onAccountChange(signer, updateAccount);
    }
  }

  return (
    <div>
      <Container>
      <h1 className="CenterText"> 
        Common Will Demo
      </h1>
      <button onClick={onClickConnect}>
        Connect
      </button>
      <div>
        account: {account}
      </div>
    </Container>
    </div>
     
  );
}

export default App;

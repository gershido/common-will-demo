import React, {useState, useEffect} from 'react';
import './App.css';
import {useWeb3Context} from './context/Web3Context';
import ConnectButton from './components/ConnectButton';
import { ContractDetails } from './components/ContractData';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

function App() {
  const web3Context = useWeb3Context();
  const signer = web3Context.state.signer;
  const account = web3Context.state.account;
  const updateAccount = web3Context.updateAccount;


  return (
    <div>
      <Container>
        <Row className="mt-2 mb-2">
          <ConnectButton/>
        </Row>
        <Row> 
          {signer ? <ContractDetails/> : null}
        </Row>
      </Container>
        
        
    </div>
     
  );
}

export default App;

import React, {useState, useEffect} from 'react';
import './App.css';
import {useWeb3Context} from './context/Web3Context';
import { useSafeContext } from './context/SafeContext';
import ConnectButton from './components/ConnectButton';
import {CreateSafe} from './components/CreateSafe';
import { ExistingSafe } from './components/ExistingSafe';
import { InitSafe } from './components/InitSafe';
import { ContractDetails } from './components/SafeDetails';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

function App() {
  const web3Context = useWeb3Context();
  const signer = web3Context.state.signer;
  const account = web3Context.state.account;
  const updateAccount = web3Context.updateAccount;

  let safeContext = useSafeContext();

  return (
    <div>
      <Container>
        <Row className="mt-2 mb-4">
          <ConnectButton/>
        </Row>
        <Row className="mb-4">
          {signer ? <InitSafe/> : null}
        </Row>
        <Row>
          {safeContext.state.safe ? <ContractDetails/> : null}
        </Row>
      </Container>
    </div>
  );
}

export default App;

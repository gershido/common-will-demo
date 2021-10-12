import React, { useState, useEffect } from 'react';
import getProvider from './components/Provider.js';
import PledgeForm from './components/PledgeForm.js';
import { ethers, Contract, BigNumber } from 'ethers';
import './App.css';
import 'bn.js';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

function App() {
  const [signer, setSigner] = useState(undefined);
  const [pledgeToken, setPledgeToken] = useState(undefined);
  const [proxy, setProxy] = useState(undefined);
  const [judge, setJudge] = useState(undefined);
  const [pledgeAmount, setPledgeAmount] = useState('0');
  const [totalPledge, setTotalPledge] = useState('0');
  const [minPledge, setMinPledge] = useState('0');
  const [minPledgeTime, setMinPledgeTime] = useState('0');

  const getMyPledge = async () => {
    try{
      const currentAddress = await signer.getAddress();
      let currentPledgeBig = await proxy.pledges(currentAddress);
      let currentPledgeAmount = BigNumber.from(currentPledgeBig);
      currentPledgeAmount = currentPledgeAmount.div(BigNumber.from('1000000000000000000'));
      setPledgeAmount(currentPledgeAmount.toString());
    } catch(err){
      console.log(err);
    }
  }

  const support = async (e) => {
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
    let currentPledgeBig = await proxy.pledges(currentAddress);
    let currentPledgeAmount = BigNumber.from(currentPledgeBig);
    currentPledgeAmount = currentPledgeAmount.div(BigNumber.from('1000000000000000000'));
    setPledgeAmount(currentPledgeAmount.toString());
  };

  const getTotalPledge = async () =>{
    try{
      let totalPledgeTemp = await proxy.totalPledge();
      totalPledgeTemp = BigNumber.from(totalPledgeTemp);
      let totalPledge = totalPledgeTemp.div(BigNumber.from('1000000000000000000'));
      setTotalPledge(totalPledge.toString());
    } catch(err){
      console.log(err);
    }
  };

  const getMinPledge = async () => {
    try{
      let minPledgeTemp = await proxy.minPledge();
      minPledgeTemp = BigNumber.from(minPledgeTemp);
      let minPledge = minPledgeTemp.div(BigNumber.from('1000000000000000000'));
      setMinPledge(minPledge.toString());
    } catch(err){
      console.log(err);
    }
  }

  const getMinPledgeTime = async () => {
    try{
      let minPledgeTimeTemp = await proxy.minPledgeDueTime();
      let minPledgeTime = new Date(minPledgeTimeTemp*1000).toUTCString();
      setMinPledgeTime(minPledgeTime);
    } catch(err){
      console.log(err);
    }
  }

  const getJudge = async () => {
    try{
      let judge = await proxy.judge();
      setJudge(judge);
    } catch(err){
      console.log(err);
    }
  }

  useEffect(() => {
    const init = async () => {
      const { signer, pledgeToken, proxy } = await getProvider();
      setPledgeToken(pledgeToken);
      setSigner(signer);
      setProxy(proxy);
    };
    init();
  }, []);

  useEffect(() => {
    const listenEvents = async () => {
      proxy.on("Pledge", (from, amount, event) => {
        getMyPledge();
        getTotalPledge();
        console.log("Pledged!", amount);
      });
    };
    if (typeof signer != 'undefined' && typeof proxy != 'undefined'){
      listenEvents();
    }
  }, [proxy]);

  useEffect(() => {
    if(
      typeof signer != 'undefined' && typeof proxy != 'undefined'
    ) {
      getTotalPledge();
      getMinPledge();
      getMinPledgeTime();
      getJudge();
      getMyPledge();
    }
  });



  return (
    (typeof signer === 'undefined' || typeof proxy === 'undefined') ? 'Loading...' : (
    <Container fluid>
      <Row>
        <h1 className="header">Welcome!</h1> 
      </Row>
      <Row>
        <div className="mb-2">Contract Address: {proxy.address}</div>
        <div className="mb-2">Current total pledge: {totalPledge}</div>
        <div className="mb-2">Min pledge: {minPledge}</div>
        <div className="mb-2">Min pledge due time: {minPledgeTime}</div>
        <div className="mb-2">Judge Address: {judge}</div>
        <div className="mb-4">My pledge: {pledgeAmount}</div>
      </Row>
      <Row>
        <PledgeForm signer={signer} proxy={proxy} pledgeToken={pledgeToken}/>
      </Row>
      
    </Container>
  ));
}

export default App;

import React, { useState, useEffect } from 'react';
import getProvider from './components/Provider.js';
import { ethers, Contract, BigNumber } from 'ethers';
import 'bn.js';

function App() {
  const [signer, setSigner] = useState(undefined);
  const [pledgeToken, setPledgeToken] = useState(undefined);
  const [proxy, setProxy] = useState(undefined);
  const [pledgeAmount, setPledgeAmount] = useState('0');

  useEffect(() => {
    const init = async () => {
      const { signer, pledgeToken, proxy } = await getProvider();
      setPledgeToken(pledgeToken);
      setSigner(signer);
      setProxy(proxy);
    };
    init();
  }, []);

  if(
    typeof signer === 'undefined'
  ) {
    return 'Loading...';
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

  return (
    <div className='container'>

      <div className='row'>
        <div className='col-sm-12'>
          <h1 className='text-center'>CG Process</h1>
          <div className="jumbotron">
            <h1 className="display-4 text-center">One line description</h1>
            <p className="lead text-center">Time Line</p>
          </div>
        </div>
      </div>

    <div className='row'>
      <h2>Support</h2>
      <form className="form-inline" onSubmit={e => support(e)}>
        <input 
          type="text" 
          className="form-control mb-2 mr-sm-2" 
          placeholder="Pledge Amount (PledgeToken)"
        />
        <button 
          type="submit" 
          className="btn btn-primary mb-2"
        >
          Submit
        </button>
      </form>
    </div>

    <div className='row'>
      <h2>Your pledge: {pledgeAmount}</h2>
    </div>

  </div>
  );
}

export default App;
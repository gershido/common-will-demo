import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {Web3Provider} from './context/Web3Context';
import {ContractDataProvider} from './context/ContractDataContext';

import 'bootstrap/dist/css/bootstrap.min.css';


ReactDOM.render(
  <React.StrictMode>
    <Web3Provider>
      <ContractDataProvider>
        <App />
      </ContractDataProvider>
    </Web3Provider>
  </React.StrictMode>,
  document.getElementById('root')
);



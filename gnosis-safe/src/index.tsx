import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {Web3Provider} from './context/Web3Context';
import {SafeProvider} from './context/SafeContext';

import 'bootstrap/dist/css/bootstrap.min.css';


ReactDOM.render(
  <React.StrictMode>
    <Web3Provider>
      <SafeProvider>
        <App />
      </SafeProvider>
    </Web3Provider>
  </React.StrictMode>,
  document.getElementById('root')
);



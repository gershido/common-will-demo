import React, { useContext, useReducer } from "react";
import ethers from "ethers";
import { EthersAdapter } from '@gnosis.pm/safe-core-sdk';

interface IStateWeb3{
    signer: ethers.providers.JsonRpcSigner | undefined;
    ethersAdapter: EthersAdapter | undefined;
    account: string;
}

const INITIAL_STATE_WEB3 : IStateWeb3 = {
    signer: undefined,
    ethersAdapter: undefined,
    account: '',
}

const Web3Context = React.createContext({
    state: INITIAL_STATE_WEB3,
    updateAccount: (_data: { account: string; ethersAdapter?: EthersAdapter | undefined; signer?: ethers.providers.JsonRpcSigner |undefined }) => {},
});

export function useWeb3Context(){
    return useContext(Web3Context);
}

interface IUpdateAccount{
    type: "UPDATE_ACCOUNT",
    account: string,
    ethersAdapter?: EthersAdapter | undefined,
    signer?: ethers.providers.JsonRpcSigner | undefined,
}

type Action = IUpdateAccount;

function reducer(state: IStateWeb3, action: Action){
    switch (action.type){
        case "UPDATE_ACCOUNT":{
            const signer = action.signer || state.signer;
            const ethersAdapter = action.ethersAdapter ? action.ethersAdapter : state.ethersAdapter;
            const account = action.account;

            return {
                ...state,
                account,
                ethersAdapter,
                signer,
            }
        }
        default:
            return state;
    }
}

interface ProviderProps {}
  
export const Web3Provider: React.FC<ProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE_WEB3);

  function updateAccount(data: { account: string; ethersAdapter?: EthersAdapter | undefined; signer?: ethers.providers.JsonRpcSigner | undefined }) {
    dispatch({
      type: "UPDATE_ACCOUNT",
      ...data,
    });
  }

  return (
    <Web3Context.Provider value= {
        {state, updateAccount}
    }>
      {children}
    </Web3Context.Provider>
  );
};


import React, { useContext, useReducer } from "react";
import ethers from "ethers";

interface IStateWeb3{
    signer: ethers.providers.JsonRpcSigner | undefined;
    account: string;
}

const INITIAL_STATE_WEB3 : IStateWeb3 = {
    signer: undefined,
    account: '',
}

const Web3Context = React.createContext({
    state: INITIAL_STATE_WEB3,
    updateAccount: (_data: { account: string; signer?: ethers.providers.JsonRpcSigner |undefined }) => {},
});

export function useWeb3Context(){
    return useContext(Web3Context);
}

interface IUpdateAccount{
    type: "UPDATE_ACCOUNT",
    account: string,
    signer?: ethers.providers.JsonRpcSigner | undefined,
}

type Action = IUpdateAccount;

function reducer(state: IStateWeb3, action: Action){
    switch (action.type){
        case "UPDATE_ACCOUNT":{
            const signer = action.signer || state.signer;
            const {account} = action;

            return {
                ...state,
                signer,
                account
            }
        }
        default:
            return state;
    }
}

interface ProviderProps {}
  
export const Web3Provider: React.FC<ProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE_WEB3);

  function updateAccount(data: { account: string; signer?: ethers.providers.JsonRpcSigner | undefined }) {
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


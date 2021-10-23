import React from "react";
import ethers from "ethers";
import { useContext, useReducer } from "react";

interface IStateWeb3{
    signer: ethers.providers.JsonRpcSigner | null;
    account: string;
}

const INITIAL_STATE_WEB3 : IStateWeb3 = {
    signer: null,
    account: '',
}

const Web3Context = React.createContext({
    state: INITIAL_STATE_WEB3,
    updateAccount: (_data: { account: string; signer?: ethers.providers.JsonRpcSigner |null }) => {},
});

export function useWeb3Context(){
    return useContext(Web3Context);
}

interface IUpdateAccount{
    type: "UPDATE_ACCOUNT",
    account: string,
    signer?: ethers.providers.JsonRpcSigner | null,
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

  function updateAccount(data: { account: string; signer?: ethers.providers.JsonRpcSigner | null }) {
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


  //
  //export function Updater() {
  //  const { state, updateNetId } = useWeb3Context();
  //
  //  useEffect(() => {
  //    if (state.web3) {
  //      const unsubscribe = subscribeToAccount(state.web3, (error, account) => {
  //        if (error) {
  //          console.error(error);
  //        }
  //        if (account !== undefined && account !== state.account) {
  //          window.location.reload();
  //        }
  //      });
  //
  //      return unsubscribe;
  //    }
  //  }, [state.web3, state.account]);
  //
  //  useEffect(() => {
  //    if (state.web3) {
  //      const unsubscribe = subscribeToNetId(state.web3, (error, netId) => {
  //        if (error) {
  //          console.error(error);
  //        }
  //        if (netId) {
  //          if (state.netId === 0) {
  //            updateNetId({ netId });
  //          } else if (netId !== state.netId) {
  //            window.location.reload();
  //          }
  //        }
  //      });
  //
  //      return unsubscribe;
  //    }
  //  }, [state.web3, state.netId, updateNetId]);
  //
  //  return null;
  //}
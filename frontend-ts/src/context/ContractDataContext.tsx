import React, {useContext, useReducer} from "react";
import {BigNumber} from 'ethers';

interface IContractData{
    totalPledge: BigNumber | undefined;
    myPledge: BigNumber | undefined;
    judge: string | undefined;
    minimalPledge: BigNumber | undefined;
    minimalPledgeTime: string | undefined;
    totalTime: string | undefined;
    winner: string | undefined;
}

const INITIAL_STATE_DATA : IContractData= {
    totalPledge: BigNumber.from(0),
    myPledge: BigNumber.from(0),
    judge: '',
    minimalPledge: BigNumber.from(0),
    minimalPledgeTime: '',
    totalTime: '',
    winner: '',
}

const ContractDataContext = React.createContext({
    state: INITIAL_STATE_DATA,
    updateTotalPledge: (totalPledge: BigNumber | undefined) => {},
    updateMyPledge: (myPledge: BigNumber | undefined, totalPledge: BigNumber | undefined) => {},
    updateAll: (
        totalPledge: BigNumber | undefined,
        myPledge: BigNumber | undefined,
        judge: string | undefined,
        minimalPledge: BigNumber | undefined,
        minimalPledgeTime: string | undefined,
        totalTime: string | undefined,
        winner: string | undefined,
    ) => {},
});

export function useContractDataContext(){
    return useContext(ContractDataContext);
}

interface IUpdateTotalPledge{
    type: 'UPDATE_TOTAL_PLEDGE';
    totalPledge: BigNumber | undefined;
}

interface IUpdateMyPledge{
    type: 'UPDATE_MY_PLEDGE';
    totalPledge: BigNumber | undefined;
    myPledge: BigNumber | undefined;
}

interface IUpdateAll{
    type: 'UPDATE_ALL',
    totalPledge: BigNumber | undefined;
    myPledge: BigNumber | undefined;
    judge: string | undefined;
    minimalPledge: BigNumber | undefined;
    minimalPledgeTime: string | undefined;
    totalTime: string | undefined;
    winner: string | undefined;
}

type Action = IUpdateTotalPledge | IUpdateMyPledge | IUpdateAll;

function reducer(state: IContractData, action: Action){
    switch (action.type){
        case "UPDATE_TOTAL_PLEDGE":{
            return {
                ...state,
                totalPledge: action.totalPledge,
            }
        }
        case "UPDATE_MY_PLEDGE":{
            return {
                ...state,
                totalPledge: action.totalPledge,
                myPledge: action.myPledge,
            }
        }
        case "UPDATE_ALL":{
            return{
                totalPledge : action.totalPledge,
                myPledge: action.myPledge,
                judge: action.judge,
                minimalPledge: action.minimalPledge,
                minimalPledgeTime: action.minimalPledgeTime,
                totalTime: action.totalTime,
                winner: action.winner,
            }
        }
        default:{
            return state;
        }
    }
}


interface ProviderProps {}
  
export const ContractDataProvider: React.FC<ProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE_DATA);

  function updateTotalPledge(totalPledge: BigNumber | undefined) {
    dispatch({
      type: "UPDATE_TOTAL_PLEDGE",
      totalPledge: totalPledge,
    });
  }

  function updateMyPledge(myPledge: BigNumber | undefined, totalPledge: BigNumber | undefined) {
    dispatch({
      type: "UPDATE_MY_PLEDGE",
      totalPledge: totalPledge,
      myPledge: myPledge,
    });
  }

  function updateAll(
    totalPledge: BigNumber | undefined,
    myPledge: BigNumber | undefined,
    judge: string | undefined,
    minimalPledge: BigNumber | undefined,
    minimalPledgeTime: string | undefined,
    totalTime: string | undefined,
    winner: string | undefined,
  ) {
    dispatch({
      type: "UPDATE_ALL",
      totalPledge: totalPledge,
      myPledge: myPledge,
      judge: judge,
      minimalPledge: minimalPledge,
      minimalPledgeTime: minimalPledgeTime,
      totalTime: totalTime,
      winner: winner,
    });
  }

  return (
    <ContractDataContext.Provider value= {
        {state, updateTotalPledge, updateMyPledge, updateAll}
    }>
      {children}
    </ContractDataContext.Provider>
  );
};
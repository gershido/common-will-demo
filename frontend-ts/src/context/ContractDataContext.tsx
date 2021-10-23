import React, {useContext, useReducer} from "react";

interface IContractData{
    totalPledge: number;
    myPledge: number;
    judge: string;
    minimalPledge: number;
    minimalPledgeTime: number;
    totalTime: number;
    winner: string;
}

const INITIAL_STATE_DATA : IContractData= {
    totalPledge: 0,
    myPledge: 0,
    judge: '',
    minimalPledge: 0,
    minimalPledgeTime: 0,
    totalTime: 0,
    winner: '',
}

const ContractDataContext = React.createContext({
    state: INITIAL_STATE_DATA,
    updateTotalPledge: (totalPledge: number) => {},
    updateMyPledge: (myPledge: number, totalPledge: number) => {},
    updateAll: (
        totalPledge: number,
        myPledge: number,
        judge: string,
        minimalPledge: number,
        minimalPledgeTime: number,
        totalTime: number,
        winner: string,
    ) => {},
});

export function useContractDataContext(){
    return useContext(ContractDataContext);
}

interface IUpdateTotalPledge{
    type: 'UPDATE_TOTAL_PLEDGE';
    totalPledge: number;
}

interface IUpdateMyPledge{
    type: 'UPDATE_MY_PLEDGE';
    totalPledge: number;
    myPledge: number;
}

interface IUpdateAll{
    type: 'UPDATE_ALL',
    totalPledge: number;
    myPledge: number;
    judge: string;
    minimalPledge: number;
    minimalPledgeTime: number;
    totalTime: number;
    winner: string;
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

  function updateTotalPledge(totalPledge: number) {
    dispatch({
      type: "UPDATE_TOTAL_PLEDGE",
      totalPledge: totalPledge,
    });
  }

  function updateMyPledge(myPledge: number, totalPledge: number) {
    dispatch({
      type: "UPDATE_MY_PLEDGE",
      totalPledge: totalPledge,
      myPledge: myPledge,
    });
  }

  function updateAll(
    totalPledge: number,
    myPledge: number,
    judge: string,
    minimalPledge: number,
    minimalPledgeTime: number,
    totalTime: number,
    winner: string,
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
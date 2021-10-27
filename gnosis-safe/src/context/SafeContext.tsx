import React, { useContext, useReducer } from "react";
import Safe from '@gnosis.pm/safe-core-sdk';

interface IStateSafe{
    safe: Safe | undefined;
}

const INITIAL_STATE_SAFE : IStateSafe = {
    safe: undefined
}

const SafeContext = React.createContext({
    state: INITIAL_STATE_SAFE,
    updateSafe: (safe: Safe) => {},
});

export function useSafeContext(){
    return useContext(SafeContext);
}

interface IUpdateSafe{
    type: "UPDATE_SAFE",
    safe: Safe | undefined,
}

type Action = IUpdateSafe;

function reducer(state: IStateSafe, action: Action){
    switch (action.type){
        case "UPDATE_SAFE":{
            const safe = action.safe || state.safe;

            return {
                ...state,
                safe, 
            }
        }
        default:
            return state;
    }
}

interface ProviderProps {}
  
export const SafeProvider: React.FC<ProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE_SAFE);

  function updateSafe(safe: Safe) {
    dispatch({
      type: "UPDATE_SAFE",
      safe,
    });
  }

  return (
    <SafeContext.Provider value= {
        {state, updateSafe}
    }>
      {children}
    </SafeContext.Provider>
  );
};


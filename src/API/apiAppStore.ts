import { create } from 'zustand'
import { logger } from './loggerMw'



type T_defaultAction<P> = (payload?: P) => void

type T_State = {
    curDir   : string;
    curName  : string;
    isName   : boolean;
    curFlight: number;
    isFight  : boolean;
}

type T_StateUPD = Partial<T_State>

interface T_Actions {
    stateUPD: T_defaultAction<T_StateUPD>
}




const initialState: T_State = {
    curDir   : ".",
    curName  : "...",
    curFlight: 1,
    isName   : false,
    isFight  : false,
}

const SELECTORS = {
    allState : (state: T_State) => state,
    curDir   : (state: T_State) => state.curDir,
    curName  : (state: T_State) => state.curName,
    isName   : (state: T_State) => state.isName,
    curFlight: (state: T_State) => state.curFlight,
    isFlight : (state: T_State) => state.isFight,
}

const ACTIONS = {
    stateUPD : (actions: T_Actions) => actions.stateUPD,
}

const useStore = create<T_State & T_Actions>()(logger(set => {
    return {
        ...initialState,
        stateUPD: ( payload ) => set( state => ({...state, ...payload })),
    }
}))


function useAppState() {
    const curState = useStore(SELECTORS.allState)
    return curState
}




export {
    useStore  as useApiAppStore,
    SELECTORS as API_APP_SELECTORS,
    ACTIONS   as API_APP_ACTIONS,
    useAppState,
}

export type {
    T_State    as T_apiAppState,
    T_StateUPD as T_apiAppStateUPD,
    T_Actions  as T_apiAppActions,
}
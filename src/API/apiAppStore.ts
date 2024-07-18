import { create } from 'zustand'
import { logger } from './loggerMw'



type T_defaultAction<P> = (payload?: P) => void

type T_State = {
    cur_dir    : string;
    flight     : number;
    add_flight : boolean;
    cur_nick   : string;
    add_nick   : boolean;
    nick_list  : string[];
}

type T_StateUPD = Partial<T_State>

interface T_Actions {
    stateUPD: T_defaultAction<T_StateUPD>
}




const initialState: T_State = {
    cur_dir   : ".",
    flight    : 1,
    add_flight: false,
    cur_nick  : "",
    add_nick  : false,
    nick_list : [],
}

const SELECTORS = {
    allState  : (state: T_State) => state,
    cur_dir   : (state: T_State) => state.cur_dir,
    cur_nick  : (state: T_State) => state.cur_nick,
    nick_list : (state: T_State) => state.nick_list,
    isNick    : (state: T_State) => state.add_nick,
    flight    : (state: T_State) => state.flight,
    add_flight: (state: T_State) => state.add_flight,
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
import { create } from 'zustand'
import { logger } from './loggerMw'


type T_OperatorsList = Record<string, string[]>
type T_defaultAction<P> = (payload?: P) => void

type T_State = {
    cur_dir    : string;
    flight     : number;
    add_flight : boolean;
    cur_nick   : string;
    add_nick   : boolean;
    operators_list: T_OperatorsList | null;
    auto_play  : boolean;
}

type T_StateUPD = Partial<T_State>

interface T_Actions {
    stateUPD: T_defaultAction<T_StateUPD>
}




const initialState: T_State = {
    cur_dir   : '.',
    flight    : 1,
    add_flight: false,
    cur_nick  : '',
    add_nick  : false,
    operators_list: null,
    auto_play : true,
}

const SELECTORS = {
    allState  : (state: T_State) => state,
    cur_dir   : (state: T_State) => state.cur_dir,
    cur_nick  : (state: T_State) => state.cur_nick,
    operators_list: (state: T_State) => state.operators_list,
    isNick    : (state: T_State) => state.add_nick,
    flight    : (state: T_State) => state.flight,
    add_flight: (state: T_State) => state.add_flight,
    auto_play : (state: T_State) => state.auto_play,
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
    T_OperatorsList,
    T_State    as T_apiAppState,
    T_StateUPD as T_apiAppStateUPD,
    T_Actions  as T_apiAppActions,
}
import { create } from 'zustand'
import { logger } from './loggerMw'

type T_defaultAction<P> = (payload?: P) => void

type T_appStateMsg = {type: string, text: string};

type T_State = {
    is_soft_mode: Boolean,
}

type T_StateUPD = Partial<T_State>

interface T_Actions {
    stateUPD        : T_defaultAction<T_StateUPD>
}

const _initialState: T_State = {
    is_soft_mode     : false,
}

const SELECTORS = {
    allState       : (state: T_State) => state,
    is_soft_mode   : (state: T_State) => state.is_soft_mode,
}

const ACTIONS = {
    stateUPD : (actions: T_Actions) => actions.stateUPD,
}

const useStore = create<T_State & T_Actions>()(logger(set => {
    return {
        ..._initialState,
        stateUPD        : ( payload ) => set( state => ({...state, ...payload })),
    }
}))


function useConfigState() {
    const apiConfigState = useStore(SELECTORS.allState)
    return apiConfigState
}




export {
    useStore  as useApiConfigStore,
    SELECTORS as API_CONFIG_SELECTORS,
    ACTIONS   as API_CONFIG_ACTIONS,
    useConfigState,
}

export type {
    T_appStateMsg,
    T_State    as T_apiConfigState,
    T_StateUPD as T_apiConfigStateUPD,
    T_Actions  as T_apiConfigActions,
}
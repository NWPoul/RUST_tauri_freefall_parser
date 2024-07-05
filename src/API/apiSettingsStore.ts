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


function useSettingsState() {
    const apiSettingsState = useStore(SELECTORS.allState)
    return apiSettingsState
}




export {
    useStore  as useApiSettingsStore,
    SELECTORS as API_SETTINGS_SELECTORS,
    ACTIONS   as API_SETTINGS_ACTIONS,
    useSettingsState,
}

export type {
    T_appStateMsg,
    T_State    as T_apiSettingsState,
    T_StateUPD as T_apiSettingsStateUPD,
    T_Actions  as T_apiSettingsActions,
}
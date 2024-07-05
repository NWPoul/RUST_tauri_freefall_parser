import { create } from 'zustand'
import { logger } from './loggerMw'

type T_defaultAction<P> = (payload?: P) => void

type T_State = {
    speed_set    ?: number;
    speed_act    ?: number;
    ventilation  ?: {inlet: number; vanes: number};
    sys_config   ?: {
        api_requested: boolean;
        api_addr     : 'PROD'| 'DEV';
        flasher_port : string,
        serial_ports : string[],

    };
}

type T_StateUPD = Partial<T_State>
type T_appStateMsg = {type: string, text: string};

interface T_Actions {
    stateUPD: T_defaultAction<T_StateUPD>
}

const WRONG_SPEED_VAL = -1
const WRONG_VENT_VAL  = -999
const DEFAULT_VENT_CONFIG = {
    inlet: WRONG_VENT_VAL,
    vanes: WRONG_VENT_VAL,
}
const DEFAULT_SYS_CONFIG = {
    api_requested: true,
    api_addr     : 'PROD',
    flasher_port : "",
    serial_ports : [""],
} satisfies T_State["sys_config"]

const _initialState: T_State = {
    speed_set   : WRONG_SPEED_VAL,
    speed_act   : WRONG_SPEED_VAL,
    ventilation : DEFAULT_VENT_CONFIG,
    sys_config  : DEFAULT_SYS_CONFIG,
}

const SELECTORS = {
    allState     : (state: T_State) => state,
    speedSet     : (state: T_State) => state.speed_set,
    speedAct     : (state: T_State) => state.speed_act,
    ventilation  : (state: T_State) => state.ventilation,
    sys_config   : (state: T_State) => state.sys_config,
}

const ACTIONS = {
    stateUPD : (actions: T_Actions) => actions.stateUPD,
}

const useStore = create<T_State & T_Actions>()(logger(set => {
    return {
        ..._initialState,
        stateUPD: ( payload ) => set( state => ({...state, ...payload })),
    }
}))


function useAppSystemState() {
    const apiState = useStore(SELECTORS.allState)

    const systemState = {
        speedSet    : apiState.speed_set,
        speedAct    : apiState.speed_act,
        ventilation : apiState.ventilation,
        sys_config  : apiState.sys_config,
    }
    return systemState
}



export {
    WRONG_SPEED_VAL,
    WRONG_VENT_VAL,
    DEFAULT_VENT_CONFIG,
    useStore    as useApiSystemStore,
    SELECTORS   as API_SYSTEM_SELECTORS,
    ACTIONS     as API_SYSTEM_ACTIONS,
    useAppSystemState,
}

export type {
    T_appStateMsg as T_appSystemStateMsg,
    T_State       as T_apiSystemState,
    T_StateUPD    as T_apiSystemStateUPD,
    T_Actions     as T_apiSystemActions,
}
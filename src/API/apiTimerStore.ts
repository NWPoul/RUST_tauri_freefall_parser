import { create } from 'zustand'
import { logger } from './loggerMw'



type T_defaultAction<P> = (payload?: P) => void

type T_appTimerStateMsg = {type: string, text: string};

type T_State = {
    is_running      : boolean;
    remaining_time  : number;
    elapsed_time    : number;
    set_time        : number;
    cur_timeblock   : number;
    next_timeblock  : number;
    is_cycle        : boolean;
    msg            ?: string;
}

type T_StateUPD = Partial<T_State>

interface T_Actions {
    stateUPD        : T_defaultAction<T_StateUPD>
}



function _parseApiTimerStateMsg(msg: string):T_appTimerStateMsg  {
    try {
        const parsedMsg = JSON.parse(msg)
        if ('type' in parsedMsg && 'text' in parsedMsg) {
            const {type, text} = parsedMsg
            return {type, text} as T_appTimerStateMsg
        } else {
            console.warn("Msg not meet format!", msg)
            const synthMsg = {
                type: "",
                text: 'text' in parsedMsg ? parsedMsg.text : ""
            }
            return synthMsg
        }
    } catch {
        return {type: "", text: msg}
    }
}



const _initialState: T_State = {
    is_running     : false,
    remaining_time : 0,
    elapsed_time   : 0,
    set_time       : 0,
    cur_timeblock  : 0,
    next_timeblock : 0,
    is_cycle       : false,
    msg            : "",
}

const SELECTORS = {
    allState       : (state: T_State) => state,
    is_running     : (state: T_State) => state.is_running,
    remainingTime  : (state: T_State) => state.remaining_time,
    elapsed_time   : (state: T_State) => state.elapsed_time,
    set_time       : (state: T_State) => state.set_time,
    cur_timeblock  : (state: T_State) => state.cur_timeblock,
    next_timeblock : (state: T_State) => state.next_timeblock,
    is_cycle       : (state: T_State) => state.is_cycle,
    msg            : (state: T_State) => state.msg,
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


function useAppTimerState() {
    const apiState = useStore(SELECTORS.allState)

    const timerState = {
        isPlaying    : apiState.is_running,
        curRemTime   : apiState.remaining_time,
        elapsedTime  : apiState.elapsed_time,
        duration     : apiState.set_time,
        timeblocks   : {
            cur : apiState.cur_timeblock,
            next: apiState.next_timeblock,
            loop: apiState.is_cycle,
        },
        message      : _parseApiTimerStateMsg(apiState.msg || ""),
        flashSoftMode: false,
    }
    return timerState
}




export {
    useStore  as useApiTimerStore,
    SELECTORS as API_TIMER_SELECTORS,
    ACTIONS   as API_TIMER_ACTIONS,
    useAppTimerState,
}

export type {
    T_appTimerStateMsg,
    T_State    as T_apiTimerState,
    T_StateUPD as T_apiTimerStateUPD,
    T_Actions  as T_apiTimerActions,
}
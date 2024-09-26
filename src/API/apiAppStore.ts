import { create } from 'zustand'
import { logger } from './loggerMw'


type T_OperatorsList    = Record<string, string[]>
type T_defaultAction<P> = (payload?: P) => void


type T_CamInfo = {
    model : string;
    serial: string;
}
type T_MaxAccData = {
    acc : number;
    time: number;
}
type T_FileTelemetryData = {
    file_name   : string;
    cam_info    : T_CamInfo;
    start_time  : number;
    end_time    : number;
    max_acc_data: T_MaxAccData;
}
type T_FileOkRec  = [string, T_FileTelemetryData]
type T_FileErrRec = [string, string]
type T_ChosenFiles= [T_FileOkRec[]|[], T_FileErrRec[]|[]]
  

type T_State = {
    cur_dir    : string;
    flight     : number;
    add_flight : boolean;
    cur_nick   : string;
    add_nick   : boolean;
    auto_play  : boolean;
    operators_list   : T_OperatorsList | null;
    chosen_files_data: T_ChosenFiles   | null;
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
    auto_play : true,
    operators_list: null,
    chosen_files_data  : null,
}

const SELECTORS = {
    allState  : (state: T_State) => state,
    cur_dir   : (state: T_State) => state.cur_dir,
    cur_nick  : (state: T_State) => state.cur_nick,
    isNick    : (state: T_State) => state.add_nick,
    flight    : (state: T_State) => state.flight,
    add_flight: (state: T_State) => state.add_flight,
    auto_play : (state: T_State) => state.auto_play,
    operators_list: (state: T_State) => state.operators_list,
    chosen_files  : (state: T_State) => state.chosen_files_data,
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
    T_ChosenFiles, T_FileOkRec, T_FileErrRec,
    T_State    as T_apiAppState,
    T_StateUPD as T_apiAppStateUPD,
    T_Actions  as T_apiAppActions,
}
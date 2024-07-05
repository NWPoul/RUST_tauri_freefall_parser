import { invoke }                from "@tauri-apps/api/tauri"
import {
    appWindow,
    WebviewWindow,
    WindowOptions,
}                                from '@tauri-apps/api/window'
import {
    emit,
    listen,
    type UnlistenFn,
    type Event,
    type EventCallback,
}                                from '@tauri-apps/api/event'


import {
    T_apiTimerState,
    T_apiTimerStateUPD,
}                                from "./apiTimerStore"
import {
    T_apiSystemState,
    T_apiSystemStateUPD,
}                                from "./apiSystemStore"
import {
    T_apiSettingsStateUPD,
    T_apiSettingsState
}                                from "./apiSettingsStore"



type T_controlInputId =
    | "StartPause"
    | "Start"
    | "Stop"
    | "StartTimeblock"
    | "StartNextTimeblock"
    | "SetNextTimeblock"
    | "RestartTimeblock"
    | "Increment"
    | "ClearTimeblocks"
    | "ToggleCycle"
    | "UpdateMessage"
    | "RunFlasher"
type T_controlInput = {
    id : T_controlInputId;
    val: string | number;
}


type T_settingsInputId =
    | "ToggleFlesherMode"
    | "SetFlesherMode"
type T_settingsInput = {
    id : T_settingsInputId;
    val: string | number | boolean;
}

type T_systemInput =
    | { id: "SetApiStatus"  , val: {Bool   : boolean } }
    | { id: "SetApiAddress" , val: {Text   : string  } }
    | { id: "SetFlasherPort", val: {Text   : string  } }
    | { id: "PushApiValues" , val: {Array16: number[]} }
    | { id: "RunFlasher"    , val: {Text   : string  } }



type T_API_timer_stateUpdatePayload    = T_apiTimerStateUPD
type T_API_system_stateUpdatePayload   = T_apiSystemStateUPD
type T_API_settings_stateUpdatePayload = T_apiSettingsStateUPD



async function API_isFullscreen() {
    return await appWindow.isFullscreen()
}

async function API_getWindowLabel() {
    const currentWindowLabel = await appWindow.label
    return currentWindowLabel
}

async function API_getTimerStoreData() {
    let resp = await invoke("get_timer_store_data")
    return resp as T_apiTimerState
}
async function API_sendControlInput(input: T_controlInput) {
    let resp = await invoke(
        "front_control_input",
        {input: {
            id : input.id,
            val: input.val.toString(),
        }}
    ) as string
    console.log('API_sendControlInput:', resp)
    return resp as string
}


async function API_getSystemStoreData() {
    let resp = await invoke("get_system_store_data")
    return resp as T_apiSystemState
}
async function API_sendSystemInput(input: T_systemInput) {
    console.log('API_sendSystemlInput: ', input)
    let resp = await invoke(
        "front_system_input",
        {input},
    )
    console.log('API_sendSystemlInput resp: ', resp)
    return resp
}


async function API_getSettingsData() {
    let resp = await invoke("get_settings_data")
    return resp as T_apiSettingsState
}
async function API_sendSettingsInput(input: T_settingsInput) {
    let resp = await invoke(
        "front_settings_input",
        {input: {
            id : input.id,
            val: input.val.toString(),
        }}
    ) as string
    console.log('API_sendSettingslInput resp: ', resp)
    return resp as string
}


function API_setFullscreen(reqFullscreen: boolean) {
    appWindow.setFullscreen(reqFullscreen)
}



function get_API_stateUpdeteListener<T_Payload>(eventId: string) {
    return (handler: EventCallback<T_Payload>) => listen<T_Payload>(eventId, handler )
}
const API_UPD_EVENT_LISTENERS = {
    timerState   : get_API_stateUpdeteListener<T_API_timer_stateUpdatePayload>('timer-state-update-event'),
    systemState  : get_API_stateUpdeteListener<T_API_system_stateUpdatePayload>('system-state-update-event'),
    settingsState: get_API_stateUpdeteListener<T_API_settings_stateUpdatePayload>('settings-state-update-event'),
}


function API_createPanel(label:string, config?:WindowOptions) {
    const _defaultWindowConfig = {"title": label}
    // const webview = new WebviewWindow('MINI_'+(Math.random()*1000).toFixed(0).toString(), {
    const webview = new WebviewWindow(label, config || _defaultWindowConfig)

    webview.once('tauri://created', ( ) => {console.log("tauri://created")})
    webview.once('tauri://error'  , (e) => {console.log("tauri://error", e)})
    return webview
}


async function API_togglePanel(label:string, config?:WindowOptions) {
    try {
        const controlWindow = await WebviewWindow.getByLabel(label)
        if (controlWindow) {
            await controlWindow.close()
        } else {
            API_createPanel(label,config)
        }
    } catch (error) {
        console.error('Error toggling  window:', label, error)
    }
}



export {
    API_getWindowLabel,
    API_isFullscreen,
    API_setFullscreen,
    API_createPanel,
    API_togglePanel,

    API_UPD_EVENT_LISTENERS,

    API_getTimerStoreData,
    API_sendControlInput,

    API_getSystemStoreData,
    API_sendSystemInput,

    API_getSettingsData,
    API_sendSettingsInput,
}

export type {
    Event,
    EventCallback,
    UnlistenFn,
    WindowOptions,
}
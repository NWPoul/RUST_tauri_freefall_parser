import { invoke }                from '@tauri-apps/api/tauri'
import {
    appWindow,
    WebviewWindow,
    WindowOptions,
}                                from '@tauri-apps/api/window'
import {
    // emit,
    listen,
    type UnlistenFn,
    type Event,
    type EventCallback,
}                                from '@tauri-apps/api/event'


import {
    T_apiAppState,
    T_apiAppStateUPD,
}                                from './apiAppStore'
import {
    T_apiConfigStateUPD,
    T_apiConfigState
}                                from './apiConfigStore'



type T_controlInputId =
    | 'selectVideoFiles'
    | 'setFreefallTime'
    | 'setFlight'
    | 'toggleFlight'
    | 'setCurNick'
    | 'newNick'
    | 'toggleAutoPlay'
    | 'openParserFolder'

type T_controlInput = {
    id : T_controlInputId;
    val: string | number;
}


type T_configInputId =
    | 'ToggleFlesherMode'
    | 'SetFlesherMode'
type T_configInput = {
    id : T_configInputId;
    val: string | number | boolean;
}


type T_API_app_stateUpdatePayload    = T_apiAppStateUPD
type T_API_config_stateUpdatePayload = T_apiConfigStateUPD




async function API_minimizeWindow() {
    try {
        return await appWindow.minimize()
    } catch (error) {
        console.error('Error minimizing  window:', error)
    }
}
// async function API_unminimizeWindow() {
//     try {
//         await appWindow.unminimize()
//     } catch (error) {
//         console.error('Failed to unminimize the window', error)
//     }
// }


async function API_getWindowLabel() {
    const currentWindowLabel = await appWindow.label
    return currentWindowLabel
}

async function API_getAppStoreData() {
    const resp = await invoke('get_app_store_data')
    return resp as T_apiAppState
}
async function API_sendControlInput(input: T_controlInput) {
    const resp = await invoke(
        'front_control_input',
        {input: {
            id : input.id,
            val: input.val.toString(),
        }}
    ) as string
    console.log('API_sendControlInput:', resp)
    return resp as string
}



async function API_getConfigStoreData() {
    const resp = await invoke('get_config_store_data')
    return resp as T_apiConfigState
}
async function API_sendConfigInput(input: T_configInput) {
    const resp = await invoke(
        'front_config_input',
        {input: {
            id : input.id,
            val: input.val.toString(),
        }}
    ) as string
    console.log('API_sendConfiglInput resp: ', resp)
    return resp as string
}




function get_API_eventistener<T_Payload>(eventId: string) {
    return (handler: EventCallback<T_Payload>) => listen<T_Payload>(eventId, handler )
}
const API_EVENT_LISTENERS = {
    appState   : get_API_eventistener<T_API_app_stateUpdatePayload>('app-state-update-event'),
    configState: get_API_eventistener<T_API_config_stateUpdatePayload>('config-state-update-event'),
    backendNotification: get_API_eventistener<[string, string]>('backend-notification'),
}




function API_createPanel(label:string, config?:WindowOptions) {
    const _defaultWindowConfig = {'title': label}
    // const webview = new WebviewWindow('MINI_'+(Math.random()*1000).toFixed(0).toString(), {
    const webview = new WebviewWindow(label, config || _defaultWindowConfig)

    webview.once('tauri://created', ( ) => {console.log('tauri://created')})
    webview.once('tauri://error'  , (e) => {console.log('tauri://error', e)})
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
    API_minimizeWindow,
    API_createPanel,
    API_togglePanel,

    API_EVENT_LISTENERS,

    API_getAppStoreData,
    API_sendControlInput,

    API_getConfigStoreData,
    API_sendConfigInput,
}

export type {
    Event,
    EventCallback,
    UnlistenFn,
    WindowOptions,

    T_controlInput,
}
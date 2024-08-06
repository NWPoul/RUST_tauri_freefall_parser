import { useEffect, useState }      from 'react'
import {
    API_EVENT_LISTENERS,
    API_togglePanel,
    API_getWindowLabel,

    API_getAppStoreData,
    API_sendControlInput,

    API_getConfigStoreData,
    API_sendConfigInput,

    type Event,
    type EventCallback,
    type UnlistenFn,
    type WindowOptions,
    type T_controlInput,
}                                   from './api'

import {
    useApiAppStore,
    API_APP_ACTIONS,
    type T_apiAppStateUPD,
}                                   from './apiAppStore'

import {
    configStore,
    type T_apiConfigStateUPD,
}                                   from './apiConfigStore'



type T_StateUPDPayload =
    | T_apiAppStateUPD
    | T_apiConfigStateUPD



const WINDOW_CONFIG = {
    CONTROL: {
        "label": "CONTROL",
        "fullscreen": false,
        "resizable": false,
        "title": "control panel",
        "width": 1280,
        "height": 1024
    },
    DISPLAY: {
        "label": "DISPLAY",
        "fullscreen": false,
        "resizable": true,
        "title": "display panel",
        "width": 1300,
        "height": 1000
    },
} as const




function useWindowLabel() {
    const [windowLabel, setWindowLabel] = useState("")
    API_getWindowLabel().then(setWindowLabel)
    return windowLabel
}


function initApiStateData() {
    const appState = useApiAppStore.getState()
    API_getAppStoreData().then(
        appState.stateUPD
    )

    API_getConfigStoreData().then(
        configStore.set
    )
}


function _getAPIstateUpdateHandler<P extends T_StateUPDPayload>(
    stateUpdater: (payload:P)=>void
):EventCallback<P> {
    return (event) => {
        const newState = event.payload
        console.log(`Got StateUpdateEvent in window ${event.windowLabel}, newState `, newState, event)
        stateUpdater(newState)
    }
}





function useRustAppStateUpdateEvent() {
    const updateApiAppState = useApiAppStore(API_APP_ACTIONS.stateUPD)
    useEffect(
        () => {
            const handler = _getAPIstateUpdateHandler<T_apiAppStateUPD>(updateApiAppState)
            const unlisten = API_EVENT_LISTENERS.appState(handler)
            return () => { unlisten.then(unlistenFn => unlistenFn()) }
        }, [updateApiAppState]
    )
}


function useRustConfigStateUpdateEvent() {
    const updateApiConfigState = configStore.updState
    useEffect(
        () => {
            const handler = _getAPIstateUpdateHandler<T_apiConfigStateUPD>(updateApiConfigState)
            const unlisten = API_EVENT_LISTENERS.configState(handler)
            return () => { unlisten.then(unlistenFn => unlistenFn()) }
        }, [updateApiConfigState]
    )
}

function useParsedVideoEvent() {
    const handler = (e:any) => console.log("PARSED EVENT!", e)
    useEffect(
        () => {
            const unlisten = API_EVENT_LISTENERS.parsedEvent(handler)
            return () => { unlisten.then(unlistenFn => unlistenFn()) }
        }, [handler]
    )
}






export {
    WINDOW_CONFIG,
    useWindowLabel,
    initApiStateData,
    useRustAppStateUpdateEvent,
    useRustConfigStateUpdateEvent,
    useParsedVideoEvent,

    API_togglePanel      as sendTogglePanelCommand,
    API_sendControlInput as sendControlInputCommand,
    API_sendConfigInput  as sendConfigInputCommand,
}

export type {
    WindowOptions,
    T_controlInput,
}


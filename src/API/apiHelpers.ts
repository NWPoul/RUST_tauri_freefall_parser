import { useEffect, useState }      from 'react'
import {
    API_isFullscreen,
    API_setFullscreen,
    API_getWindowLabel,
    API_togglePanel,

    API_UPD_EVENT_LISTENERS,

    API_getTimerStoreData,
    API_sendControlInput,

    API_getSystemStoreData,

    API_sendSettingsInput,
    API_sendSystemInput,


    type Event,
    type EventCallback,
    type UnlistenFn,
    type WindowOptions,
}                                   from './api'

import {
    useApiTimerStore,
    API_TIMER_ACTIONS,
    type T_apiTimerStateUPD,
}                                   from './apiTimerStore'
import {
    useApiSystemStore,
    API_SYSTEM_ACTIONS,
    type T_apiSystemStateUPD,
}                                   from './apiSystemStore'
import {
    API_SETTINGS_ACTIONS,
    useApiSettingsStore,
    type T_apiSettingsStateUPD,
}                                   from './apiSettingsStore'



type T_StateUPDPayload =
    | T_apiTimerStateUPD
    | T_apiSystemStateUPD
    | T_apiSettingsStateUPD



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
    SERV: {
        "url": "src/serv_window/",
        "label": "SERV",
        "title": "serv panel",
        "fullscreen": false,
        "resizable": false,
        "width": 300,
        "height": 800,
        "alwaysOnTop": true
    },
} as const




function initApiStateData() {
    const timerState = useApiTimerStore.getState()
    API_getTimerStoreData().then(
        timerState.stateUPD
    )

    const systemState = useApiSystemStore.getState()
    API_getSystemStoreData().then(
        systemState.stateUPD
    )
}


function _getAPIstateUpdateHandler<P extends T_StateUPDPayload>(
    stateUpdater: (payload?:P)=>void
):EventCallback<P> {
    return (event) => {
        const newState = event.payload
        console.log(`Got StateUpdateEvent in window ${event.windowLabel}, newState `, newState, event)
        stateUpdater(newState)
    }
}





function useRustTimerStateUpdateEvent() {
    const updateApiTimerState = useApiTimerStore(API_TIMER_ACTIONS.stateUPD)
    useEffect(
        () => {
            const handler = _getAPIstateUpdateHandler<T_apiTimerStateUPD>(updateApiTimerState)
            const unlisten = API_UPD_EVENT_LISTENERS.timerState(handler)
            return () => { unlisten.then(unlistenFn => unlistenFn()) }
        }, [updateApiTimerState]
    )
}

function useRustSystemStateUpdateEvent() {
    const updateApiSystemState = useApiSystemStore(API_SYSTEM_ACTIONS.stateUPD)
    useEffect(
        () => {
            const handler = _getAPIstateUpdateHandler<T_apiSystemStateUPD>(updateApiSystemState)
            const unlisten = API_UPD_EVENT_LISTENERS.systemState(handler)
            return () => { unlisten.then(unlistenFn => unlistenFn()) }
        }, [updateApiSystemState]
    )
}

function useRustSettingsStateUpdateEvent() {
    const updateApiSettingsState = useApiSettingsStore(API_SETTINGS_ACTIONS.stateUPD)
    useEffect(
        () => {
            const handler = _getAPIstateUpdateHandler<T_apiSettingsStateUPD>(updateApiSettingsState)
            const unlisten = API_UPD_EVENT_LISTENERS.settingsState(handler)
            return () => { unlisten.then(unlistenFn => unlistenFn()) }
        }, [updateApiSettingsState]
    )
}




function useFullscreen() {
    const [isFullscreen, setIsFullscreen] = useState(false)
    useEffect(
        () => {
            console.log(`isFullscreen ${isFullscreen}`)
            toggleFullscreen(isFullscreen)
        }, [isFullscreen]
    )
    return [isFullscreen, setIsFullscreen] as const
}
async function toggleFullscreen(reqFullscreen?: boolean) {
    reqFullscreen ??= !(await API_isFullscreen())
    API_setFullscreen(reqFullscreen)
}

function useWindowLabel() {
    const [windowLabel, setWindowLabel] = useState("")
    API_getWindowLabel().then(setWindowLabel)
    return windowLabel
}

API_togglePanel



export {
    WINDOW_CONFIG,
    useWindowLabel,
    useFullscreen,
    toggleFullscreen,
    initApiStateData,
    useRustTimerStateUpdateEvent,

    useRustSystemStateUpdateEvent,
    useRustSettingsStateUpdateEvent,
    // createMiniPanel,
    API_togglePanel       as sendTogglePanelCommand,
    API_sendControlInput  as sendControlInputCommand,
    API_sendSettingsInput as sendSettingsInputCommand,
    API_sendSystemInput   as sendSystemInputCommand,
}

export type {
    WindowOptions
}




// type T_stateUpdater<P extends T_UPDPayload> = (payload?: P) => void

// function getRustTimerStateUpdateHook<
//     P extends T_UPDPayload,
//     E extends Event<P>,
// >(
//     stateUpdater: T_stateUpdater<P>,
//     eventType: keyof typeof API_UPD_EVENT_LISTENERS,
// ) {
//     const handler = getAPIstateUpdateHandler<E>(stateUpdater)
//     useEffect(
//         () => {
//             const unlisten = API_UPD_EVENT_LISTENERS[eventType](handler)
//             const cleaner  = () => { unlisten.then(unlistenFn => unlistenFn()) }
//             return cleaner
//         },
//         []
//     )
// }
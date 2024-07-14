import { useEffect} from 'react'

import { cx }                       from 'helpers'

import {
    // useWindowLabel,
    // useFullscreen,
    // toggleFullscreen,
    // createMiniPanel,
    sendControlInputCommand,
    // useRustSystemStateUpdateEvent,
    useRustAppStateUpdateEvent,
    useRustConfigStateUpdateEvent,
}                                   from 'API/apiHelpers'


import {
    useAppState,
}                                   from 'API/apiAppStore'
import {
    configStore,
}                                   from 'API/apiConfigStore'


import { MainPanelLayout }          from './MainPanelLayout'


import { TogglePanelBtn }           from './TogglePanelBtn'



export function MainPanel() {
    useRustAppStateUpdateEvent()
    useRustConfigStateUpdateEvent()

    const appState   = useAppState()
    const sys_state  = configStore.use()

    const className = cx( 'AppServWrapper'
    )


    return (
        <div id = "AppServ"
            className     = {className}
            onContextMenu = {e => e.preventDefault()}
        >

            <MainPanelLayout
                APP_STATE={appState}
                CONFIG_STATE={sys_state}
            />

            <div id="panelBtn-wrapper">
                <TogglePanelBtn
                    label = {'CONTROL'}
                    text  = 'CP'
                />
                <TogglePanelBtn
                    label = {'DISPLAY'}
                    text  = 'DP'
                />
            </div>
        </div>
    );
}

export default MainPanel

// {
//             <button type="button" onClick={() => toggleFullscreen(isFullscreen, setIsFullscreen)}>
//                 {` TURN FULLSCREEN ${isFullscreen ? "OFF" : "ON"}`}
//             </button>
//             <br />
            // <button type="button" onClick={API_toggleApp}>
            //     TOGGLE APP
            // </button>
            // <br />
            // <button type="button" onClick={API_RestartTimeblock}>
            //     RESET TIMEBLOCK
            // </button>
// }
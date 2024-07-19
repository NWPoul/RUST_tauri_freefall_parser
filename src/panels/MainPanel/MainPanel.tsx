import { useEffect} from 'react'

import { cx }                       from 'helpers'


import { API_minimizeWindow }       from 'API/api'

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


import { IncButtonBlock }           from 'components/controls/buttons'

import {
    useKeys,
}                                   from './serv'
import { NickSelect }               from './NickSelect'
import { FlightNumberBlock }        from './FlightNumberBlock'





function openFiles() {
    sendControlInputCommand(
        {
            id: "openFiles",
            val: "",
        }
    )
    console.log('openFilesBtn')
}






function updFFTime(newVal: number) {
    sendControlInputCommand({
        id: "setFreefallTime",
        val: newVal
    })
}
function FreeFallSettingsBlock({ffTime}:{ffTime: number}) {
    return (
        <div id="time_freefall_settings" data-tauri-drag-region>
            FF cut time&nbsp;
            <IncButtonBlock
                val    = {ffTime}
                incVal = {10}
                minVal = {10}
                maxVal = {300}
                valUpdateHandler = {updFFTime}
            />
        </div>
    )
}





export function MainPanel() {
    useRustAppStateUpdateEvent()
    useRustConfigStateUpdateEvent()

    const appState    = useAppState()
    const configState = configStore.use()

    useKeys()

    const className = cx( 'MainPanelWrapper' )

    const doubleClickEventHandler = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
        const eTarget = e.target as HTMLDivElement
        const watchedElements = ['BackBase', 'mainBtnBlock']
        if ( watchedElements.includes(eTarget.id) === false) {
            return
        }
        API_minimizeWindow()
    }


    return <div id = "BackBase" data-tauri-drag-region onDoubleClick={doubleClickEventHandler}>
        <div id = "AppMainPanel" data-tauri-drag-region
            className     = {className}
            onContextMenu = {e => e.preventDefault()}
        >
            <div className="mainPanel-controlsWrapper" data-tauri-drag-region>
                <FreeFallSettingsBlock ffTime={configState.time_freefall}/>
                <br />

                <div id = "mainBtnBlock" className="mainBtnBlock" data-tauri-drag-region>
                    <NickSelect
                        curNick  = {appState.cur_nick}
                        nickList = {appState.nick_list}
                        isMuted  = {!appState.add_nick}
                    />
                    <br />

                    <FlightNumberBlock
                        flightN = {appState.flight}
                        isMuted = {!appState.add_flight}
                    />
                </div>
                <button
                    type      = "button"
                    className = "quickBtn selectFilesBtn"
                    onClick   = {openFiles}
                >
                    Выбрать файлы
                </button>
            </div>
        </div>
    </div>
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

import { cx }                       from 'helpers'

import { API_minimizeWindow }       from 'API/api'

import {
    sendControlInputCommand,
    useRustAppStateUpdateEvent,
    useRustConfigStateUpdateEvent,
}                                   from 'API/apiHelpers'

import { useAppState }              from 'API/apiAppStore'
import { configStore }              from 'API/apiConfigStore'

import { IncButtonBlock }           from 'components/controls/buttons'

import { FallIcon, StopWatchIcon }  from 'assets/SVG_Icons'
import { useKeys }                  from './serv'

import { AppHeader }                from './AppHeader'
import { NickSelect }               from './NickSelect'
import { FlightNumberBlock }        from './FlightNumberBlock'
import { ControlGroupAF }           from './controlGroupAF'





function selectVideoFiles() {
    sendControlInputCommand(
        {
            id: "selectVideoFiles",
            val: "",
        }
    )
    console.log('selectVideoFilesBtn')
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
            <div id="timeSetIconGroup">
                <div id="fallIconDiv">{FallIcon}</div>
                <div id="stopWatchDiv">{StopWatchIcon}</div>
            </div>
            &nbsp;
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
    console.log('MainPanel ~ appState:', appState)
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
        <AppHeader/>
        
        <div id = "AppMainPanel" data-tauri-drag-region
            className     = {className}
            onContextMenu = {e => e.preventDefault()}
        >
            <div className="mainPanel-controlsWrapper" data-tauri-drag-region>
                <FreeFallSettingsBlock ffTime={configState.time_freefall}/>
                <br />

                <div id = "mainBtnBlock" className="mainBtnBlock" data-tauri-drag-region>
                    <NickSelect
                        isMuted        = {!appState.add_nick}
                        curNick        = {appState.cur_nick}
                        operators_list = {appState.operators_list}
                    />

                    <FlightNumberBlock
                        flightN = {appState.flight}
                        isMuted = {!appState.add_flight}
                    />
                    <ControlGroupAF
                        isAutoPlayMuted = {!appState.auto_play}
                    />
                </div>
                <button
                    type      = "button"
                    className = "quickBtn selectFilesBtn"
                    onClick   = {selectVideoFiles}
                >
                    Парсить файлы
                </button>
            </div>
        </div>
    </div>
}

export default MainPanel
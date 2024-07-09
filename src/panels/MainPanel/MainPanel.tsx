import { useEffect} from 'react'

import { cx }                       from 'helpers'

import {
    // useWindowLabel,
    // useFullscreen,
    // toggleFullscreen,
    // createMiniPanel,
    sendSystemInputCommand,
    useRustSystemStateUpdateEvent,
    useRustTimerStateUpdateEvent,
}                                   from 'API/apiHelpers'


import {
    useAppTimerState,
}                                   from 'API/apiTimerStore'
import {
    useAppSystemState,
}                                   from 'API/apiSystemStore'


import {
    RemTimeScreen,
}                                   from 'components/ClockBlock'

import { MainPanelLayout }          from './MainPanelLayout'

import {
    apiToggleTimer,
}                                   from './serv'

import { TogglePanelBtn }           from './TogglePanelBtn'



export function MainPanel() {
    useRustTimerStateUpdateEvent()
    useRustSystemStateUpdateEvent()

    const timerState = useAppTimerState()
    const sys_state  = useAppSystemState()

    const className = cx( 'AppServWrapper',
        timerState.isPlaying                || 'timer-idle',
        sys_state.sys_config?.api_requested || 'api-idle',
    )


    return (
        <div id = "AppServ"
            className     = {className}
            onContextMenu = {e => e.preventDefault()}
        >
            <div id="RemTimeScreen-wrapper"
                onClick={apiToggleTimer}
            >
                <RemTimeScreen time={timerState.curRemTime}/>
            </div>


            <MainPanelLayout
                QCTIMER_STATE={timerState}
                SYTSTEM_STATE={sys_state}
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
            // <button type="button" onClick={API_toggleTimer}>
            //     TOGGLE TIMER
            // </button>
            // <br />
            // <button type="button" onClick={API_RestartTimeblock}>
            //     RESET TIMEBLOCK
            // </button>
// }
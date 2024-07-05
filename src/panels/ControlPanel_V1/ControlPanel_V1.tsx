// import { useEffect, useState, useRef } from 'react'

import {
    useRustTimerStateUpdateEvent,
}                                      from 'API/apiHelpers'
import {
    useAppTimerState,
}                                      from 'API/apiTimerStore'
// import {
//     useAppSystemState,
// }                                      from 'API/apiSystemStore'


import { ClockBlock }                  from 'components/ClockBlock'

import {
    getControls,
    WindowReloadButton,
}                                      from 'panels/controls'

import { SpeedIndicator }              from 'components/SpeedIndicator'
import { VentilationIndicator }        from 'components/VentilationIndicator'

import { ControlsLayoutV1 }            from './ControlsLayout_V1'

import './panel_styles_V1.css'




export function ControlPanel_V1() {
    useRustTimerStateUpdateEvent()

    const timerState  = useAppTimerState()
    const controls    = getControls(timerState)


    return (
        <div
            id="AppTimer"
            className="split-ver2"
            onContextMenu={e => e.preventDefault()}
        >
            <div id="leftBlock">
                <ClockBlock
                    {...timerState}
                    sizeOpt = {'SMALL'}
                />
                <SpeedIndicator/>
                <VentilationIndicator/>
            </div>

            <div id="rightBlock">
                <ControlsLayoutV1
                    QCTIMER_STATE={timerState}
                    {...controls}
                />
            </div>
            <WindowReloadButton/>
        </div>
    );
}

export default ControlPanel_V1

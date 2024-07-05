// import { useEffect, useState, useRef } from 'react'

import {
    useRustTimerStateUpdateEvent,
}                                      from 'API/apiHelpers'
import {
    // API_TIMER_SELECTORS,
    // useApiTimerStore,
    useAppTimerState,
}                                      from 'API/apiTimerStore'


import { ClockBlock }                  from 'components/ClockBlock'

import {
    getControls,
    // ControlsLayout_SPLIT,
    // type T_QCTIMER_STATE
}                                      from 'panels/controls'
import { SpeedIndicator }              from 'components/SpeedIndicator'
import { VentilationIndicator }        from 'components/VentilationIndicator'
import { TimeblocksList }              from 'components/TimeblocksList'

import 'components/ClockBlock/clockBlockFZone.css'
import './styles.css'



export function DisplayPanel() {
    useRustTimerStateUpdateEvent()

    const timerState = useAppTimerState()
    getControls(timerState)


    return (
        <div
            id="AppTimer"
            className='displayPanel'
            onContextMenu={e => e.preventDefault()}
        >
            <div id="leftBlock">
                <ClockBlock
                    {...timerState}
                    sizeOpt = {'BIG'}
                />
            </div>

            <div id="rightBlock">
                <TimeblocksList
                    timeblocks={timerState.timeblocks}
                    onlyDifferNext
                />
                <SpeedIndicator/>
                <VentilationIndicator/>
            </div>
        </div>
    );
}

export default DisplayPanel

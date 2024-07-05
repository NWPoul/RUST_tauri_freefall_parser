import { useState, useMemo, useCallback, useEffect } from 'react'


import {
    useKeyCodemap,
    useLongPress,
    useRepeatableLongPress,
    LongPressEventType,

    type T_repeatableLongPressEvent,
}                                        from 'customHooks'

import {
    WINDOW_CONFIG,
    sendControlInputCommand,
    sendTogglePanelCommand,
}                                        from 'API/apiHelpers'
import { T_appTimerStateMsg}             from 'API/apiTimerStore'
import { GET_KEYCODE_ACTIONS }           from './controlsKeyMap'
import { MESSAGES }                      from './messageServ'


import type {T_QCTIMER_STATE}            from './types'


type T_controlActionName = keyof typeof CONTROL_ACTIONS;
type T_controlActions    = Record<T_controlActionName, (args?: any) => void|undefined>

type T_clickActionsType = 'PRIME' | 'ALTER' | 'START'

type T_clickAction = (
    ControlsActions: T_controlActions,
    dataset: Partial<Record<string, unknown>>
) => void|undefined;

type T_CLICK_ACTIONS = Record<
    T_clickActionsType,
    Record<string, T_clickAction>
>;



const CONTROL_ACTIONS = {
    startPause: (forcedState: boolean | null = null) => {
        const payload = {
            id : 'StartPause',
            val: "",
        } as const
        sendControlInputCommand(payload)
    },

    startTimeBlock: (timeVal: number) => {
        const payload = {
            id : 'StartTimeblock',
            val: timeVal,
        } as const
        sendControlInputCommand(payload)
    },

    startNextBlock: () => {
        const payload = {
            id : 'StartNextTimeblock',
            val: "",
        } as const
        sendControlInputCommand(payload)
    },

    setNextBlock: (timeVal: number) => {
        const payload = {
            id : 'SetNextTimeblock',
            val: timeVal,
        } as const
        sendControlInputCommand(payload)
    },

    restartBlock: () => {
        const payload = {
            id : 'RestartTimeblock',
            val: "",
        } as const
        sendControlInputCommand(payload)
    },

    clearTimeblocks: () => {
        const payload = {
            id : 'ClearTimeblocks',
            val: "",
        } as const
        sendControlInputCommand(payload)
    },

    toggleCycle: () => {
        const payload = {
            id : 'ToggleCycle',
            val: "",
        } as const
        sendControlInputCommand(payload)
    },

    incrementRemainingTime: (timeval: number) => {
        const payload = {
            id : 'Increment',
            val: timeval,
        } as const
        sendControlInputCommand(payload)
    },

    updateMessage: (msg: T_appTimerStateMsg|string) => {
        const payload = {
            id : 'UpdateMessage',
            val: typeof msg === 'string' ? msg : JSON.stringify(msg),
        } as const
        sendControlInputCommand(payload)
    },

    runFlasher: () => {
        const payload = {
            id : 'RunFlasher',
            val: "",
        } as const
        sendControlInputCommand(payload)
    },

    toggleServPanel: () => {
        const label = 'SERV'
        const config = WINDOW_CONFIG[label]
        sendTogglePanelCommand(label, config)
    },

    // const toggleFlasherSoftMode = (mode = !API_OBJ.flashSoftMode) => {
    //     UPDATE_QCTIMER_STATE(API_OBJ.setQCTIMER_STATE, { flashSoftMode: mode });
    // }
} as const



const CLICK_ACTIONS:T_CLICK_ACTIONS = {PRIME:{},ALTER:{},START:{}} as const
CLICK_ACTIONS.PRIME = {
    msgBtn: (ControlsActions, dataset) => {
        const messageId  = dataset.message
        const messageObj = {messageId, ...MESSAGES[messageId as keyof typeof MESSAGES]}
        return void ControlsActions.updateMessage( messageObj )
    },


    qBtn:   (ControlsActions, dataset: {timeval?: string}) => {
        let timeval = dataset?.timeval && parseInt(dataset?.timeval)
        if (timeval) ControlsActions['startTimeBlock'](timeval)
    },

    incBtn: (ControlsActions, dataset: {timeval?: string}) => {
        let timeval = dataset?.timeval && parseInt(dataset?.timeval)
        if (timeval) ControlsActions.incrementRemainingTime(timeval)
    },

    restartBtn: (ControlsActions) => void ControlsActions.restartBlock(),
    nextBtn:    (ControlsActions) => void ControlsActions.startNextBlock(),
    cycleBtn:   (ControlsActions) => {
        console.log('file: controlsCore.tsx:142 ~ ControlsActions:', ControlsActions)

        void ControlsActions.toggleCycle()
    },
    pauseBtn:   (ControlsActions) => void ControlsActions.startPause(null),

    // flasherModeBtn: (ControlsActions) => void ControlsActions.toggleFlasherSoftMode(),
} as const

CLICK_ACTIONS.ALTER = {
    qBtn: (ControlsActions, dataset: {timeval?: string}) => {
        let timeval = dataset?.timeval && parseInt(dataset?.timeval)
        console.log('qBtn_Alter', timeval)
        if (timeval) ControlsActions.setNextBlock(timeval)
    },
} as const

CLICK_ACTIONS.START = {
    incBtn: CLICK_ACTIONS.PRIME.incBtn
} as const


function MAP_CLICK_ACTIONS(
    ControlsActions: T_controlActions   = CONTROL_ACTIONS,
    clickType      : T_clickActionsType = 'PRIME',
) {
    const clickActions = CLICK_ACTIONS[clickType]

    return (e: T_repeatableLongPressEvent<HTMLButtonElement>) => {
        const [id, dataset] = e.target instanceof HTMLElement
            ? [e.target.id.split?.('_')[0], e.target.dataset]
            : [void console.warn('MAP_CLICK_ACTIONS got not a button arg'), null]

        if ((e.target as HTMLButtonElement).disabled) return
        if (id && id in clickActions) {
            e.stopPropagation()
            const action  = clickActions[id as keyof typeof clickActions]
            action(ControlsActions, dataset)
        }
    }
}

function GET_CLICK_ACTIONS() {
    const onClick      = MAP_CLICK_ACTIONS(CONTROL_ACTIONS, 'PRIME')
    const onClickStart = MAP_CLICK_ACTIONS(CONTROL_ACTIONS, 'START')
    const onClickAlter = MAP_CLICK_ACTIONS(CONTROL_ACTIONS, 'ALTER')

    return {onClick, onClickStart, onClickAlter}
}




////////////////////////////////////////////////////////////////////////
function getControls (QCTIMER_STATE: T_QCTIMER_STATE) {
    // const [isMenu, setIsMenu] = useState(false)
    const keysActions  = useMemo(() => GET_KEYCODE_ACTIONS(CONTROL_ACTIONS),[])
    useKeyCodemap( keysActions )


    const {
        onClick,
        onClickStart,
        onClickAlter,
    }                  = useMemo(() => GET_CLICK_ACTIONS(),[])


    const longPressEvent = useLongPress<HTMLButtonElement>(
        onClickAlter,//(e) => {console.log('longPressEvent ', e)},//onAlterClick,
        {
            detect      : LongPressEventType.Pointer,
            captureEvent: true,
            onCancel    : (e) => {
                if((e as React.MouseEvent<HTMLButtonElement>).button === 2) return void onClickAlter(e)
                onClick(e)
            },
        }
    )


    const onIncBtnClick = useRepeatableLongPress<HTMLButtonElement>({
        onStart         : onClickStart,
        repeatingAction : onClickStart,
        intervalMs      : 150,
    })

    const messageUpdate = CONTROL_ACTIONS.updateMessage

    return {
        onIncBtnClick,
        messageUpdate,
        longPressEvent,
    }
}



export {
    GET_CLICK_ACTIONS,
    getControls,
}

export type {
    T_controlActions,
}
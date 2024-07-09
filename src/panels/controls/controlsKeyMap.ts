import { toggleFullscreen }      from 'API/apiHelpers'

import { MESSAGES }              from './messageServ'

import type {T_controlActions }  from './controlsCore'



export const GET_KEYCODE_ACTIONS = (ControlsActions: T_controlActions) => {
    const digitKeyActions = (timeVal: number) => (e: KeyboardEvent) => {
        if (e.repeat) { ControlsActions.setNextBlock(timeVal) }
        else { ControlsActions.startTimeBlock(timeVal) }
    }

    const keyCodeActionMap = {
        'KeyT': () => ControlsActions.updateMessage(MESSAGES.TAXI),
        'KeyL': () => ControlsActions.updateMessage(MESSAGES.LAST),
        'KeyN': () => ControlsActions.updateMessage(MESSAGES.NEXT_L),
        'KeyM': () => {
            let messageText = window.prompt('Введите короткое сообщение: ')
            if (messageText) ControlsActions.updateMessage({
                    text: messageText,
                    type: messageText.length > 30 ? 'overlap-custom' : 'overlap'
                })
        },
        'KeyH': () => ControlsActions.updateMessage(MESSAGES.HEART),
        'Delete': () => ControlsActions.updateMessage(MESSAGES.CLEAR),

        'KeyC'  : () => { ControlsActions.toggleCycle() },
        'KeyS'  : () => { ControlsActions.toggleMainPanel() },
        'KeyF'  : () => { ControlsActions.runFlasher() },


        'ArrowUp': (e: KeyboardEvent) => {
            if (e.shiftKey || e.ctrlKey) {
                document.getElementById('customBtn_secInc')?.click()
            } else
                ControlsActions.incrementRemainingTime(5)
        },
        'ArrowDown': (e: KeyboardEvent) => {
            if (e.shiftKey || e.ctrlKey) {
                document.getElementById('customBtn_secDec')?.click()
            } else
                ControlsActions.incrementRemainingTime(-5)
        },
        'ArrowRight': (e: KeyboardEvent) => {
            if (e.shiftKey || e.ctrlKey) {
                document.getElementById('customBtn_minInc')?.click()
            } else
                ControlsActions.startNextBlock()
        },
        'ArrowLeft': (e: KeyboardEvent) => {
            if (e.shiftKey || e.ctrlKey) {
                document.getElementById('customBtn_minDec')?.click()
            } else
                ControlsActions.restartBlock()
        },

        'Space': () => { ControlsActions.startPause() },

        'Digit1': digitKeyActions(1 * 60),
        'Digit2': digitKeyActions(1 * 60 + 30),
        'Digit3': digitKeyActions(2 * 60),
        'Digit4': digitKeyActions(2 * 60 + 30),
        'Digit5': digitKeyActions(3 * 60),
        'Digit6': digitKeyActions(5 * 60),
        'Digit7': (e: KeyboardEvent) => {
            const btn     = document.getElementById('qBtn_CustomBtn')
            const timeval = parseInt(btn?.dataset?.timeval || "")
            if (!timeval) return void console.warn("keycode 7 can't get timeval of customBtn!", e)
            digitKeyActions(timeval)(e)
        },
        'Digit0': () => { ControlsActions.clearTimeblocks() },

        'F11': () => { toggleFullscreen() },
    }

    const keyCodeAlias = {
        'Numpad1': 'Digit1',
        'Numpad2': 'Digit2',
        'Numpad3': 'Digit3',
        'Numpad4': 'Digit4',
        'Numpad5': 'Digit5',
        'Numpad6': 'Digit6',
        'Numpad7': 'Digit7',
        'Numpad0': 'Digit0',
        'Insert' : 'KeyC',
    }


    for (const [key, refKey] of Object.entries(keyCodeAlias)) {
        if (key in keyCodeActionMap || !(refKey in keyCodeActionMap)) continue
        const addMapProp = keyCodeActionMap[refKey as keyof typeof keyCodeActionMap]
        Object.defineProperty(keyCodeActionMap, key, {
            value: addMapProp,
            enumerable   : true,
            writable     : true,
            configurable : true,
        })
    }

    return keyCodeActionMap
}
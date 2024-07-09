import { useEffect }               from 'react'
import {
    sendControlInputCommand,
    sendSystemInputCommand,
}                                  from 'API/apiHelpers'

import { TogglePanelBtn }          from './TogglePanelBtn'



export const apiToggleTimer = () => {
    const payload = {
        id : 'StartPause',
        val: '',
    } as const
    sendControlInputCommand(payload);
}

export const apiSetStatus = (newStatus: boolean) => {
    const payload = {
        id : 'SetApiStatus',
        val: {Bool: newStatus},
    } as const
    sendSystemInputCommand(payload);
}

export const apiSetAddress = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const payload = {
        id : 'SetApiAddress',
        val: {Text: e.currentTarget.value},
    } as const
    sendSystemInputCommand(payload);
}

export const apiSetFlasherPort = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const payload = {
        id : 'SetFlasherPort',
        val: {Text: e.currentTarget.value},
    } as const
    sendSystemInputCommand(payload);
}

export const apiPushValues = (values: number[]) => {
    const payload = {
        id : 'PushApiValues',
        val: {Array16: values},
    } as const
    sendSystemInputCommand(payload);
}

export const apiRunFlasher = () => {
    const payload = {
        id : 'RunFlasher',
        val: {Text: ''},
    } as const
    sendSystemInputCommand(payload);
}


export const useKeys = () =>{
    useEffect(() => {
        const handleKeyUp = (event: KeyboardEvent) => {
            if (event.code === 'KeyF') apiRunFlasher()
        }
        window.addEventListener('keyup', handleKeyUp)
        return () => window.removeEventListener('keyup', handleKeyUp)
    }, [])
}


export {
    TogglePanelBtn,
}
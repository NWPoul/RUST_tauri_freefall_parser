import { useEffect }               from 'react'
import {
    sendControlInputCommand,
    type T_controlInput,
}                                  from 'API/apiHelpers'

import { TogglePanelBtn }          from '../../components/controls/TogglePanelBtn'



export const useKeys = () =>{
    useEffect(() => {
        const handleKeyUp = (event: KeyboardEvent) => {
            if (event.code === 'KeyF') {}// apiRunFlasher()
        }
        window.addEventListener('keyup', handleKeyUp)
        return () => window.removeEventListener('keyup', handleKeyUp)
    }, [])
}


export function getControlInputEventHandler(id: T_controlInput["id"]):
    React.MouseEventHandler<HTMLButtonElement>
{
    return (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        let val = e.currentTarget.value
        console.log(e)
        console.log(`sendControlInputCommand: ${id} (val: ${val})`)
        if (val === undefined) return

        sendControlInputCommand({id, val: val})
    }
}


export {
    TogglePanelBtn,
}
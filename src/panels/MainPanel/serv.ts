import { useEffect }               from 'react'
import {
    sendControlInputCommand,
}                                  from 'API/apiHelpers'

import { TogglePanelBtn }          from './TogglePanelBtn'



export const useKeys = () =>{
    useEffect(() => {
        const handleKeyUp = (event: KeyboardEvent) => {
            if (event.code === 'KeyF') {}// apiRunFlasher()
        }
        window.addEventListener('keyup', handleKeyUp)
        return () => window.removeEventListener('keyup', handleKeyUp)
    }, [])
}


export {
    TogglePanelBtn,
}
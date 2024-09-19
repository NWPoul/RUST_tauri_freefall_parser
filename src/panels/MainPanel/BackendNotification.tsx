import { useState }                 from 'react'

// import { cx }                       from 'helpers'
import { useBackendNotification }   from 'API/apiHelpers'

import {
    ModalDialog,
    // type T_ModalProps
}                                   from 'components/ModalDialog'



// function useNtificationDialog() {
//     const [isOpened, setIsOpened] = useState<boolean>(false)
//     return [
//         isOpened, setIsOpened,
//     ] as const
// }




export function BackendNotification() {
    const [isOpened, setIsOpened] = useState<boolean>(false)
    const [payload, setPayload]   = useState<[string, string]>(['',''])
    
    function handler([title, msg]:[string, string]) {
        setPayload([title, msg])
        setIsOpened(true)
    }
    useBackendNotification(handler)

    return (
        <ModalDialog
            title        = {payload[0]}
            isOpened     = {isOpened}
            closeBtnText = "закрыть"
            onClose      = {() => setIsOpened(false)}
        >
            {payload[1]}
        </ModalDialog>
    )
}

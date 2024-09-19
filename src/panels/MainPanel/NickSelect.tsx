import { useState }                 from 'react'

import { cx }                       from 'helpers'

import {
    sendControlInputCommand,
}                                   from 'API/apiHelpers'

import { ModalDialog }              from 'components/ModalDialog'

import type { T_OperatorsList }     from 'API/apiAppStore'


type T_NickSelectProps = {
    curNick       : string|null
    operators_list: T_OperatorsList|null
    isMuted       : boolean
}



const baseNickOptions = [
    <option key="EMPTY"
        value={''}
        className="nick-select--option no_nick"
    >
        НИК НЕ ВЫБРАН
    </option>
    ,
    <option key="NEW_NICK"
        value={'NEW_NICK'}
        className="nick-select--option new_nick"
    >
        ДОБАВИТЬ
    </option> 
]

function getNickOptions(operators_list: T_OperatorsList | null) {
    return operators_list === null
        ?   null
        :   Object.keys(operators_list).map(operator => {
                return <option key={operator}
                    value={operator}
                    className="nick-select--option"
                >
                    {operator}
                </option>
            })
}


function getNickChangeHandler(setIsOpened: React.Dispatch<React.SetStateAction<boolean>>, _onProceed?: unknown) {
    return (e: React.ChangeEvent<HTMLSelectElement>) => {
        const nickOption = e.currentTarget.value
        const payload = {
            id : 'setCurNick',
            val: nickOption,
        } as const

        if (nickOption === 'NEW_NICK') {
            setIsOpened(true)
            return
        }
        sendControlInputCommand(payload)
    }
}

function useNewNickDialog() {
    const [isOpened, setIsOpened] = useState<boolean>(false)

    return [
        isOpened, setIsOpened,
        getNickChangeHandler(setIsOpened),
    ] as const
}


function NickInputForm({setIsOpened}:{setIsOpened: React.Dispatch<React.SetStateAction<boolean>>}) {
    const [inputValue, setInputValue] = useState('')
    const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
        // e.preventDefault()
        const formData = new FormData(e.currentTarget)
        const newNick = formData.get('nick') as string ?? ''
        if (!newNick) return setIsOpened(false)

        const payload = {
            id: 'newNick',
            val: newNick,
        } as const
        sendControlInputCommand(payload)
        // alert("NEW NICK SUBMIT! " + newNick)
        // setIsOpened(false)
    }

    return <form id="nickSelectForm" onSubmit={handleSubmit} method="dialog">
        {/* <label htmlFor="nick">Enter your nick:</label> */}
        <input
            id="nick"
            name="nick"
            type="text"
            autoComplete="off"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)} />
        {/* <button type="submit">Submit</button> */}
    </form>
}



export function NickSelect(props:T_NickSelectProps) {
    const [isOpened, setIsOpened, nickChangeHandler] = useNewNickDialog()

    const nickOptions = getNickOptions(props.operators_list)

    const className = cx('quickBtn', 'nick-btn', props.isMuted && 'isMuted')

    return <>
        <ModalDialog
            title        = {'Добавить оператора:'}
            isOpened     = {isOpened}
            closeBtnText = "Отмена"
            onClose      = {() => setIsOpened(false)}
        >
            <NickInputForm setIsOpened = {setIsOpened}/>
        </ModalDialog>
        <select id="nick-select"
            name      = "nick"
            className = { className }
            value     = { props.curNick || '' }
            onChange  = { nickChangeHandler }
        >
            {baseNickOptions}
            {nickOptions}
        </select>
    </>
}

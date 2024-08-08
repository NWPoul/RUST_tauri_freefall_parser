
import { cx }                       from 'helpers'

import {
    sendControlInputCommand,
}                                   from 'API/apiHelpers'

import ModalDialog                  from 'components/ModalDialog/ModalDialog'

import type { T_OperatorsList }     from 'API/apiAppStore'
import { useState } from 'react'
import { configStore } from 'API/apiConfigStore'



type T_NickSelectProps = {
    curNick       : string|null
    operators_list: T_OperatorsList|null
    isMuted       : boolean
}

const apiSetCurNick = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nickOption = e.currentTarget.value
    const payload = {
        id : 'setCurNick',
        val: nickOption,
    } as const

    if (nickOption === 'NEW_NICK') {
        let newNick = prompt("Введите ник")
        if (!newNick || newNick === 'NEW_NICK') return
        let payload = {
            id : 'newNick',
            val: newNick,
        }  as const
        sendControlInputCommand(payload)
        return
    }

    sendControlInputCommand(payload);
}





const baseNickOptions = [
    <option key="EMPTY"
        value={""}
        className="nick-select--option no_nick"
    >
        НЕ ВЫБРАН
    </option>,

    <option key="NEW_NICK"
        value={"NEW_NICK"}
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


function getNickChangeHandler(setIsOpened: any, onProceed?: any) {
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
    const onProceed = () => {
        console.log('onProceed ')
        alert("onProceed! ")
        setIsOpened(false)
    }

    const NickForm = () => {
        const [inputValue, setInputValue] = useState('')
        const handleSubmit:React.FormEventHandler<HTMLFormElement> = (e) => {
            e.preventDefault()
            const formData = new FormData(e.currentTarget)
            const newNick = formData.get('nick') as string ?? ''
            if (!newNick) return setIsOpened(false)

            const payload = {
                id : 'newNick',
                val: newNick,
            } as const
            sendControlInputCommand(payload)
            // alert("NEW NICK SUBMIT! " + newNick)
            setIsOpened(false)
        }

        return <form onSubmit={handleSubmit} method="dialog">
            <label htmlFor="nick">Enter your nick:</label>
            <input
                id="nick"
                name="nick"
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
            />
            <button type="submit">Submit</button>
        </form>
    }

    return [
        isOpened, setIsOpened, onProceed,
        getNickChangeHandler(setIsOpened),
        NickForm,
    ] as const
}


export function NickSelect(props:T_NickSelectProps) {
    const [isOpened, setIsOpened, onProceed, nickChangeHandler, NickForm] = useNewNickDialog()

    const nickOptions = getNickOptions(props.operators_list)

    const className = cx("quickBtn", "nick-btn", props.isMuted && "isMuted")

    return <>
        <ModalDialog
            title       = {'ModalDialog'}
            isOpened    = {isOpened}
            onProceed   = {onProceed }
            onClose     = {() => setIsOpened(false)}
            // children    = {undefined}
        >
            <NickForm/>
        </ModalDialog>
        <select id="nick-select"
            name      = "nick"
            className = { className }
            value     = { props.curNick || "" }
            onChange  = { nickChangeHandler }
        >
            {baseNickOptions}
            {nickOptions}
        </select>
    </>
}

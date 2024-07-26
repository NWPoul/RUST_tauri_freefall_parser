
import { cx }                       from 'helpers'

import {
    sendControlInputCommand,
}                                   from 'API/apiHelpers'

import type { T_OperatorsList }     from 'API/apiAppStore'


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
export function NickSelect(props:T_NickSelectProps) {
    let baseNickOptions = [
        <option key="EMPTY"
            value={""}
            className="nick-select--option no_nick"
        >
            NO NAME
        </option>,

        <option key="NEW_NICK"
            value={"NEW_NICK"}
            className="nick-select--option new_nick"
        >
            NEW OPERATOR
        </option>
    ]

    let nickOptions = props.operators_list === null
        ?   null
        :   Object.keys(props.operators_list).map(operator => {
                return <option key={operator}
                    value={operator}
                    className="nick-select--option"
                >
                    {operator}
                </option>
            })

    const className = cx("quickBtn", "nick-btn", props.isMuted && "isMuted")

    return <select id="nick-select"
        name      = "nick"
        className = {className}
        value     = { props.curNick || "" }
        onChange  = { apiSetCurNick }
    >
        {baseNickOptions}
        {nickOptions}
    </select>
}

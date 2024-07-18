
import { cx }                       from 'helpers'

import {
    sendControlInputCommand,
}                                   from 'API/apiHelpers'


type T_NickSelectProps = {
    curNick      : string|null
    nickList     : string[]
    isMuted      : boolean
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
    let nickOptions = props.nickList.map(nick => {
        return <option key={nick}
            value={nick}
            className="nick-select--option"
        >
            {nick}
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

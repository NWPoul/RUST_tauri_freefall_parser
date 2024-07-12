import { useState } from 'react'

import './numpadStyles.css';



export function Numpad({updMessage, onClose}:{updMessage:(msg: string) => void, onClose: ()=>void}) {
    const [value, setValue] = useState('')

    const handleNumberClick = (e: React.MouseEvent<HTMLElement>) => {
        if ((e.target as HTMLElement).id === 'numpad-wrapper') {
            return
        }
        e.stopPropagation()
        e.preventDefault()
        const taret = e.target as HTMLElement
        const char = taret?.nodeName === 'BUTTON' ? taret.innerText : ""
        setValue(value + char);
    }

    const handleBackSpaceClick = (e: React.MouseEvent<HTMLElement>) => {
        e.stopPropagation()
        e.preventDefault()
        setValue(curValue => curValue.slice(0, -1))
    }

    const handleSubmitClick = (e: React.MouseEvent<HTMLElement>) => {
        e.stopPropagation()
        e.preventDefault()
        if (!!value) updMessage("dfghhef")
        setValue("")
        onClose()
    }

    return (
        <div className='msgModalWrapper' onClick={onClose}>
        <div id="numpad-wrapper" onClick={handleNumberClick}>
            <input id="numpad-display" type="text" value={value} readOnly />
            <div>
                <button>1</button>
                <button>2</button>
                <button>3</button>
            </div>
            <div>
                <button>4</button>
                <button>5</button>
                <button>6</button>
            </div>
            <div>
                <button>7</button>
                <button>8</button>
                <button>9</button>
            </div>
            <div>
                <button onClick={handleBackSpaceClick}>&#9668;</button>
                <button>0</button>
                <button>,&nbsp;</button>
            </div>
            <button id="numpad-enter" onClick={handleSubmitClick}>ВВОД</button>
        </div>
        </div>
    )
}
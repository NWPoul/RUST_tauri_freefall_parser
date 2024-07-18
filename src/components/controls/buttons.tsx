import { ReactNode, useState }          from 'react'

import { cx }            from 'helpers'

// import {
//     useRepeatableLongPress,
//     type T_repeatableLongPressEvent,
// }                                       from 'customHooks'

// import type {
//     LongPressResult,
//     LongPressPointerHandlers,
// }                                       from 'use-long-press'

// import { IconLock }                     from 'assets/SVG_Icons'

// ⮝⮟⯅⯆

import './styles.css'







function clampValue(value: number, min?:number, max?:number) {
    max ??= value
    min ??= value
    if (value < min) return min
    if (value > max) return max
    return value
}


export function IncButton({
    incVal,
    incHandler,
}:{
    incVal: number,
    incHandler: () => void,
}){
    let className = cx('incBtn', incVal>0 ? 'INC' : 'DEC')
    let text = incVal>0 ? '⯅' : '⯆'

    return (
        <button
            className = {className}
            onClick   = {incHandler}
        >
            {text}
        </button>
    )
}

export function IncButtonBlock({
    val,
    incVal,
    minVal,
    maxVal,
    valUpdateHandler,
}:{
    val   : number,
    incVal: number,
    minVal?: number,
    maxVal?: number,
    valUpdateHandler: (newVal: number) => void,
}){
    let className = cx('incButtonBlock')
    const incHandler = () => {
        valUpdateHandler( clampValue(val + incVal, minVal, maxVal) )
    }
        const decHandler = () => {
        valUpdateHandler( clampValue(val - incVal, minVal, maxVal) )
    }

    return (
        <div
            data-val  = {val}
            className = {className}
        >
            <IncButton incVal={-incVal} incHandler={decHandler}/>
            {val}
            <IncButton incVal={incVal} incHandler={incHandler}/>
        </div>
    )
}


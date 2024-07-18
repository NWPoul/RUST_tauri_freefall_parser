import { ReactNode, useState }          from 'react'

import { cx, secTo_MMSS_String }            from 'helpers'

import {
    useRepeatableLongPress,
    type T_repeatableLongPressEvent,
}                                       from 'customHooks'

import type {
    LongPressResult,
    LongPressPointerHandlers,
}                                       from 'use-long-press'

import { IconLock }                     from 'assets/SVG_Icons'

import './styles.css'


export type T_quickButtonProps = {
    timeVal    : number;
    hotKey    ?: string;
    idMod     ?: string;
    children  ?: ReactNode;
}

type T_customBtnProps = Omit<T_quickButtonProps, 'timeVal'> & { layout?: "ROW"|"COL"}
type T_customBtnLayoutProps = {
    hotKey?: string | undefined;
    minutes: number;
    seconds: number;
    hotKeyEmulatedClick(event: T_repeatableLongPressEvent<HTMLDivElement>): false | undefined;
    longRepeatablePressEvent: LongPressResult<LongPressPointerHandlers<HTMLDivElement>, unknown>;
    layout: "ROW"|"COL";
}

type T_messageBtnProps = {
    innerText : string;
    messageId : string;
    children ?: React.ReactNode;
}





function clampValue(value: number, min?:number, max?:number) {
    max ??= value
    min ??= value
    if (value < min) return min
    if (value > max) return max
    return value
}


// ⮝⮟⯅⯆
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


export function MessageBtn({innerText, messageId, children = null}:T_messageBtnProps) {
    let className = "quickBtn message-button"
    return (
        <button
            id = {`msgBtn_${messageId}`}
            className    = {className}
            data-message = {messageId}
        >
            {innerText}
            {children}
        </button>
    )
}


export function WindowReloadButton() {
    return (
        <button
            id="reloadBtn"
            className="quickBtn reloadBtn"
            onClick={() => window.location.reload()}
        >
            ⟳
        </button>
    )
}

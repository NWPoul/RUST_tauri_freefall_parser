import { ReactNode, useState }          from 'react'

import { secTo_MMSS_String }            from 'helpers'

import {
    useRepeatableLongPress,
    type T_repeatableLongPressEvent,
}                                       from 'customHooks'

import type {
    LongPressResult,
    LongPressPointerHandlers,
}                                       from 'use-long-press'

import { IconLock }                     from 'assets/SVG_Icons'


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



export function QuickButton({timeVal, hotKey, idMod='', children}:T_quickButtonProps) {
    children ??= secTo_MMSS_String(timeVal)
    let id   = `qBtn_${idMod ? idMod : timeVal}`
    let className = 'quickBtn'

    let loopMark  = <span className="loopMark">ЦИКЛ</span>//⭮ЦИКЛ
    // let lockMark  = <span className="lockMark">ФИКС</span>//⭮
    // let lockMark  = <i className="lockMark gg-lock"></i>//⭮
    let lockMark  = <div className="lockMark">{IconLock}</div>

    // let label     = hotKey ? <span className="qBtnLabel">{hotKey}</span> : null
    return (
        <button
            id={id}
            className={className}
            data-timeval={timeVal}
        >
            {children}
        </button>
    )
}







export function IncButton({timeVal}:{timeVal:number}){
    let id   = `incBtn_${timeVal>0 ? 'INC' : 'DEC'}`
    let text = `${timeVal>0 ? '+' : ''}${timeVal}"`

    return (
        <button
            id = {id}
            data-timeval = {timeVal}
            className    = "quickBtn inc-button"
        >
            {text}
        </button>
    )
}



export function NextButton() {
    return (
        <button
            id="nextBtn"
            className="quickBtn nextResetBtn"
        >
            {/* {"▶▶"} */}
            {"ᐅᐅ"}
        </button>
    )
}
export function RestartButton() {
    return (
        <button
            id="restartBtn"
            className="quickBtn nextResetBtn"
        >
            R
            {/* {"🗘"} */}
        </button>
    )
}
export function CycleButton({isCycle, isActive = false}:{isCycle: boolean, isActive: boolean}) {
    const className = "quickBtn cycleBtn "
                    + (isActive === false
                        ? "disabled"
                        : isCycle
                            ? "toggleCycleOff"
                            : "toggleCycleOn"
                    )

    return (
        <button
            id = "cycleBtn"
            className = {className}
            disabled = {!isActive}
        >
            цикл
        </button>
    )
}


export function PauseButton({isPlaying}:{isPlaying: boolean}) {
    return (
        <button
            id="pauseBtn"
            className="quickBtn pause-button"
        >
            {isPlaying ? 'ПАУЗА' : 'ПУСК'}
        </button>
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

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
import type{ T_timeblocks }             from './types'


// function normalizeTimePair([min, sec]) {
//     if (sec < 0) {
//         min--
//         sec = min > 0 ? 60+sec : 0
//     }
//     if (min < 0)  min = 0
//     min = min + Math.floor(sec / 60);
//     sec = sec % 60;
//     return [min, sec]
// }

export type T_quickButtonProps = {
    timeVal    : number;
    timeblocks : T_timeblocks;
    hotKey    ?: string;
    idMod     ?: string;
    children  ?: ReactNode;
}

type T_customBtnProps = Omit<T_quickButtonProps, 'timeVal'> & { layout?: "ROW"|"COL"}
type T_customBtnLayoutProps = {
    timeblocks: T_timeblocks;
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



export function QuickButton({timeVal, timeblocks, hotKey, idMod='', children}:T_quickButtonProps) {
    children ??= secTo_MMSS_String(timeVal)
    let id   = `qBtn_${idMod ? idMod : timeVal}`
    let isLoop = timeblocks.loop ?? false
    let isPrev = (timeVal == timeblocks.cur)
    let isNext = (timeVal == timeblocks.next)
    let className = 'quickBtn'
                  + `${isPrev ? ' PREV' : ''}`
                  + `${isNext ? ' NEXT' : ''}`

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
            {isNext && isLoop === false && lockMark}
            {isLoop && (isPrev || isNext) && loopMark}
            {children}
        </button>
    )
}



export function CustomButton({timeblocks, layout="COL", hotKey}:T_customBtnProps) {
    const MIN_SEC_TIME = 5 // minimum time allowed for btn
    const SEC_INC_VAL  = 5
    const MAX_MIN_TIME = 59

    const [timeValArr, setTimeVal] = useState([15,0])
    let [minutes, seconds] = timeValArr

    function changeBtnTimeval(e: T_repeatableLongPressEvent<HTMLDivElement>) {
        const btn = e.target instanceof HTMLElement
            ? e.target.id.replace('customBtn_', '')
            : void console.warn('CustomButton got not a button event')
        // eslint-disable-next-line default-case
        switch (btn) {
            case 'minInc': minutes = minutes < MAX_MIN_TIME
                                   ? minutes + 1
                                   : seconds < MIN_SEC_TIME ? 1 : 0
              break
            case 'minDec': minutes = minutes > 1
                                   ? minutes - 1
                                   : seconds < MIN_SEC_TIME ? MAX_MIN_TIME : 0
              break
            case 'secInc': seconds = seconds < 60 - SEC_INC_VAL
                                   ? seconds + SEC_INC_VAL
                                   : minutes === 0 ? MIN_SEC_TIME : 0
              break
            case 'secDec': seconds = seconds >= MIN_SEC_TIME + SEC_INC_VAL
                                   ? seconds - SEC_INC_VAL
                                   : minutes === 0 ? MIN_SEC_TIME : 0
              break
        }
        setTimeVal([minutes, seconds])
    }
    //watch for emulated event from control KeyAction
    function hotKeyEmulatedClick(event: T_repeatableLongPressEvent<HTMLDivElement>) {
        if (event.isTrusted) return false // ignore mouse click
        changeBtnTimeval(event)
    }

    const longRepeatablePressEvent = useRepeatableLongPress({
        repeatingAction: changeBtnTimeval,
        onStart:         changeBtnTimeval,
        // onCancel:        changeBtnTimeval,
        intervalMs:      100,
        threshold:       100,
    })

    return GetCustomButtonLayout({
        timeblocks,
        hotKey,
        minutes, seconds,
        layout,
        hotKeyEmulatedClick,
        longRepeatablePressEvent,
    })
}



const customBtnIncDecBloks = {
    "COL": {
        ID1: (
            <div className="customBtnSetBlock colBlock-inc">
                <button id="customBtn_minInc">▲</button>
                <button id="customBtn_secInc">▲</button>
            </div>
        ),
        ID2: (
            <div className="customBtnSetBlock colBlock-dec">
                <button id="customBtn_minDec">▼</button>
                <button id="customBtn_secDec">▼</button>
            </div>
        ),
    },
    "ROW": {
        ID1: (
            <div className="customBtnSetBlock rowBlock-min">
                <button id="customBtn_minInc">▲</button>
                <button id="customBtn_minDec">▼</button>
            </div>
        ),
        ID2: (
            <div className="customBtnSetBlock rowBlock-sec">
                    <button id="customBtn_secInc">▲</button>
                    <button id="customBtn_secDec">▼</button>
            </div>
        ),
    }
}


function GetCustomButtonLayout({
    timeblocks,
    hotKey,
    minutes, seconds,
    hotKeyEmulatedClick,
    longRepeatablePressEvent,
    layout = "COL"
}:T_customBtnLayoutProps) {
    return (
        <div
            id        = "customBtnWrapper"
            className = "customBtnWrapper"
            onClick   = {hotKeyEmulatedClick}
            {...longRepeatablePressEvent()}
        >
            { customBtnIncDecBloks[layout]['ID1'] }
            <QuickButton
                timeVal    = {minutes*60 +seconds}
                timeblocks = {timeblocks}
                idMod      = {'CustomBtn'}
                hotKey     = {hotKey}
            />
            { customBtnIncDecBloks[layout]['ID2'] }
        </div>)
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


// export const TestBtn = ({testF}) => {
//     const MODE     = window.SOFT ? 'LED' : 'HARD'
//     const onClick = (e) => testF(e)
//     return (
//         <button
//             id        = "flasherModeBtn"
//             className = "quickBtn"
//             onClick   = {onClick}
//         >
//             TEST
//         </button>
//     )
// }



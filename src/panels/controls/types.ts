import type { T_appTimerStateMsg } from "API/apiTimerStore"

type T_timeblocks = {
    cur  : number;
    next : number;
    loop : boolean;
}

type T_QCTIMER_STATE = {
    isPlaying      : boolean;
    curRemTime     : number;
    elapsedTime    : number;
    duration       : number;
    message       ?: T_appTimerStateMsg;
    flashSoftMode ?: boolean;

    timeblocks     : T_timeblocks;
}

export type {
    T_timeblocks,
    T_QCTIMER_STATE,
}
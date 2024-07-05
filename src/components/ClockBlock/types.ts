
import type { T_appTimerStateMsg } from 'API/apiTimerStore'
import type { ColorFormat }        from './CircleCountdownBar/types'


type T_clockBlockSize    = "SMALL" | "BIG"
type T_clockBlockSizeOpt = {
    [S in T_clockBlockSize]: {
        size            : number,
        strokeWidth     : number,
        trailStrokeWidth: number,
    }
}


type T_clockBlockProps = {
    isPlaying   : boolean,
    curRemTime  : number,
    elapsedTime : number,
    duration    : number,
    message    ?: T_appTimerStateMsg,

    sizeOpt     : T_clockBlockSize,
}

export type {
    T_clockBlockSize,
    T_clockBlockSizeOpt,
    T_clockBlockProps,

    ColorFormat,
}
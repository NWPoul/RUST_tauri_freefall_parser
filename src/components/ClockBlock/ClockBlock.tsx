
import {
    cx,
    setFlasher,
}                                from 'helpers'
import { CircleCountdownBar }    from 'components/ClockBlock/CircleCountdownBar'

import { ClockBlockInner }       from './ClockBlockInner'

import type {
    ColorFormat,
    T_clockBlockSizeOpt,
    T_clockBlockProps,
}                                from './types'
// import { HelloKitty }             from 'assets/SVG_Icons'
// import HelloKitty from 'assets/hello_kitty.svg'


const SIZE_OPT: T_clockBlockSizeOpt = {
    SMALL: {
        size: 240,
        strokeWidth: 10,
        trailStrokeWidth: 9,
    },
    BIG: {
        size: 240,
        strokeWidth: 12,
        trailStrokeWidth: 11,
    }
}

const getWrapperStyle = (size: number): React.CSSProperties => ({
    position: 'relative',
    width: size,
    height: size,
})



export function ClockBlock({
    isPlaying,
    curRemTime,
    elapsedTime,
    duration,
    message,
    sizeOpt = 'BIG',
}: T_clockBlockProps) {

    const {
        size,
        strokeWidth, trailStrokeWidth,
    } = SIZE_OPT[sizeOpt]

    const msgClassName = message?.type ? `msg-${message.type}` : ''
    const msgText = message?.text || ''

    const trailColor: ColorFormat = (curRemTime <= duration) ? '#000000' : '#4b6ef1'
    const baseColor : ColorFormat = !isPlaying ? '#5c5c6d' : '#2a50db'
    const className = cx('clockBlockWrapper',
        msgClassName,
        isPlaying === false && 'timer-idle'
    )



    setFlasher({
        remainingTime: curRemTime,
    })

    return (
        <div
            id="clockBlockWrapper"
            className={className}
        >
            <div style={getWrapperStyle(size)} className='clockBlockMain'>
                <CircleCountdownBar
                    isPlaying={isPlaying}
                    duration={duration}
                    remainingTime={curRemTime}
                    elapsedTime={elapsedTime}

                    size={size}
                    strokeWidth={strokeWidth}
                    trailStrokeWidth={trailStrokeWidth}

                    colors={[baseColor, '#ff7703', '#ff0000', '#ff0000']}
                    colorsTime={[11, 10, 2, 0]}
                    trailColor={trailColor}
                    strokeLinecap={'butt'}
                />
                <ClockBlockInner
                    remainingTime = {curRemTime}
                    message       = {msgText}
                />
            </div>
        </div>
    )
}


export default ClockBlock

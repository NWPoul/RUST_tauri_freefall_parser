function secTo_MMSS_String(sec: number, mmFlag = false) {
    if (!sec) return ''
    const minutes = Math.floor((sec % 3600) / 60)
    const seconds = sec % 60
    const minutesStr = minutes.toString().padStart(2, ' ')
    const secondsStr = seconds.toString().padStart(2, '0')

    return `${mmFlag ? minutesStr : minutes}:${secondsStr}`
}


type T_setFlasherProps = {
    remainingTime: number,
    setPoint     ?: number,
    flashSoftMode?: boolean,
    targetNode   ?: HTMLElement,
}
const setFlasher = ({
    remainingTime,
    setPoint      = 10,
    flashSoftMode = false,
    targetNode    = document.body
}:T_setFlasherProps) => {
    const toggle = remainingTime < setPoint && remainingTime > 0
    let alarmClassName, getBlinkDuration

    switch (flashSoftMode) {
        case true:
            alarmClassName = 'alarmSoft'
            getBlinkDuration = (remainingTime: number) => (
                remainingTime > 5 ? 1 :
                    remainingTime > 2 ? 0.5 : 0.25
            )
            break
        default:
            alarmClassName = 'alarmHard';
            getBlinkDuration = (remainingTime: number) => (
                remainingTime > 5 ? 1 :
                    remainingTime > 2 ? 0.5 : 0.25
            )
    }

    if (toggle) {
        let blinkDuration = getBlinkDuration(remainingTime)
        targetNode.style.setProperty('--blink-duration', `${blinkDuration}s`)
        targetNode.classList.add(alarmClassName)
    } else {
        targetNode.classList.remove(alarmClassName)
    }
}


// export function _i32_to_i16neg(value: number) {
//     const max_i16 = 32767
//     const i16neg = value >= 0
//         ? value
//         : value - max_i16

//     console.log("🚀 ~ _i32_to_i16neg ", value, (i16neg - max_i16 - 1))
    
//     return i16neg
// }




export {cx} from './cx'

export {
    secTo_MMSS_String,
    setFlasher,
}

export type {
    T_setFlasherProps,
}
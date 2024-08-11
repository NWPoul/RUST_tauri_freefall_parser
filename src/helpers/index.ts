function secTo_MMSS_String(sec: number, mmFlag = false) {
    if (!sec) return ''
    const minutes = Math.floor((sec % 3600) / 60)
    const seconds = sec % 60
    const minutesStr = minutes.toString().padStart(2, ' ')
    const secondsStr = seconds.toString().padStart(2, '0')

    return `${mmFlag ? minutesStr : minutes}:${secondsStr}`
}


export {cx} from './cx'

export {
    secTo_MMSS_String,
}
import { useState, useEffect } from 'react'



const formatDateTime = (dateObj: Date) => {
    let formated = dateObj.toLocaleString('ru', {
        hour:   '2-digit',
        minute: '2-digit',
    })
    return formated
}



export const RemTimeScreen = ({ time }:{time: number}) => {
    const minutes = Math.floor((time % 3600) / 60)
    const seconds = time % 60

    const minutesStr = minutes.toString().padStart(2, ' ')
    const secondsStr = seconds.toString().padStart(2, '0')

    return (
        <div className='innerBlock_remainingValue'>
            <span className='clockDigits cdMin'>{minutesStr}</span>
            <span className='clockDigits cdColon' id='clockColon'>:</span>
            <span className='clockDigits cdSec'>{secondsStr}</span>
        </div>
    )
}


const CurrentDayTimeScreen = () => {
    let [curDayTime, setCurDayTime] = useState(new Date())
    useEffect(() => {
        let interval = setInterval(() => { setCurDayTime(new Date()); }, 30000)
        return () => clearInterval(interval)
    }, [])
    return (
        <span id="message-top" className="timer-topMessage">
            {formatDateTime(curDayTime)}
        </span>
    )
}








export const ClockBlockInner = ({
    remainingTime,
    message,
}: {
    remainingTime: number,
    message     ?: string | JSX.Element,
}) => {
    const bottomMessage = typeof message === 'string'
        ? <span id="message-bottom">{message}</span>
        : <div id="message-bottom" className="message-bottom-SVG">{message}</div>

    return (
        <div className="clockBlockInner">
            <CurrentDayTimeScreen />
            <RemTimeScreen time={remainingTime} />
            {bottomMessage}
        </div>)
}


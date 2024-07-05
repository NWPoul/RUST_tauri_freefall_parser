import { useRef, useState, useEffect } from 'react'
import {
    useLongPress,
    LongPressEventType,
    type LongPressReactEvents,
    type LongPressResult,
    type LongPressPointerHandlers,
}                                      from 'use-long-press'

type T_target = HTMLDivElement | HTMLButtonElement

type T_longPressEventHandlers = LongPressResult<LongPressPointerHandlers<T_target>, unknown>

type T_repeatableLongPressEvent<E extends T_target> = LongPressReactEvents<E>
type T_eventHandler<E extends T_target> = (e: T_repeatableLongPressEvent<E>) => void | undefined
type T_props<E extends T_target> = {
    firstAction     ?: T_eventHandler<E>;
    repeatingAction ?: T_eventHandler<E>;
    onStart         ?: T_eventHandler<E>;
    onCancel        ?: T_eventHandler<E>;
    onFinish        ?: T_eventHandler<E>;
    intervalMs      ?: number;
    threshold       ?: number;
}

function _voidFn<E extends T_target>(_e: T_repeatableLongPressEvent<E>):void | undefined {}

function _clearIntervalAndRef(intervalRef: React.MutableRefObject<number | null>) {
    console.log('_clearIntervalAndRef:', intervalRef.current)
    if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
    }
}


const useRepeatableLongPress = <E extends T_target>({
    firstAction     = (_e) => void console.log('FIRST LONGPRESS action'),
    repeatingAction = (_e) => void console.log('REPEATING'),
    onStart         = _voidFn,
    onCancel        = _voidFn,
    onFinish        = _voidFn,
    intervalMs      = 100,
    threshold       = 150,
}:T_props<E>) => {
    const intervalRef               = useRef<number|null>(null)
    const [repeating, setRepeating] = useState<number|null>(null)

    const _callBack:T_eventHandler<E> = (e) => {
        // console.log('_callBack:', !repeating && intervalRef.current)
        if (!repeating) firstAction(e)
        _clearIntervalAndRef(intervalRef)
        const interval = window.setInterval(() => {
            repeatingAction(e)
            console.log('repeatingAction customBtnAction:', interval)
        }, intervalMs)
        setRepeating(interval)
    }

    const _onStart:T_eventHandler<E> = (e) => {
        console.log('STARTED')
        setRepeating(null)
        onStart(e)
    }

    const _onCancel:T_eventHandler<E> = (e) => {
        console.log('CANCELED')
        setRepeating(null)
        onCancel(e)
    }

    const _onFinish:T_eventHandler<E> = (e) => {
        console.log('FINISHED')
        setRepeating(null)
        onFinish(e)
    }



    const longPressEvent = useLongPress(
        _callBack,
        {
            threshold   : threshold,
            captureEvent: true,
            onStart     : _onStart,
            onCancel    : _onCancel,
            onFinish    : _onFinish,
            detect      : LongPressEventType.Pointer,
        }
    )

    useEffect(() => {
        if (!repeating && intervalRef.current) {
            _clearIntervalAndRef(intervalRef)
        } else intervalRef.current = repeating

        return () => _clearIntervalAndRef(intervalRef)
    }, [repeating])

    return longPressEvent
}


export {
    useLongPress,
    useRepeatableLongPress,

    LongPressEventType,
    type T_repeatableLongPressEvent,
    type T_longPressEventHandlers,
}
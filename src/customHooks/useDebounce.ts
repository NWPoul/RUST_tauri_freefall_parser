import { useRef, useEffect } from 'react'


export function useDebounce<T extends (...args: any[]) => any>(func: T, waitFor: number) {
    const callback = useRef(func)
    const timeout = useRef<ReturnType<typeof setTimeout> | null>(null)

    useEffect(() => {
        callback.current = func
    }, [func])

    return (...args: Parameters<T>) => {
        const later = () => {
            timeout.current = null
            callback.current(...args)
        }

        if (timeout.current) {
            clearTimeout(timeout.current)
        }

        timeout.current = setTimeout(later, waitFor)
    }
}
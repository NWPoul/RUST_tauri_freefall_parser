import {
    useEffect,
    useRef,
}                from 'react'

// type T_keyPressAction = (e: React.KeyboardEvent<HTMLElement>) => void
type T_keyPressAction   = (e: KeyboardEvent) => void
type T_keyCodeActionMap = {[key: string]: T_keyPressAction|undefined}

/**
 * useKeypress
 * @param {string} key - the name of the key to respond to, compared against event.key
 * @param {function} action - the action to perform on key press
 */
export function useKeypress(key:string, action: T_keyPressAction) {
  useEffect(() => {
    function onKeyup(e: KeyboardEvent) {
    //debugger
     console.log(e.key)
      if (e.key === key) {
          action(e)
          e.preventDefault()
        }
    }
    window.addEventListener('keyup', onKeyup);
    return () => window.removeEventListener('keyup', onKeyup);
  }, [action, key]);
}

export function useKeyCodemap(
    keyCodeActionMap: T_keyCodeActionMap,
    optData={},
) {
    const keyRepeatedRef = useRef<string|null>(null)

    useEffect(() => {
        function onKeydown(e: KeyboardEvent) {
            const action = keyCodeActionMap[e.code]
            if ( !action
                || !e.repeat
                ||  e.code === keyRepeatedRef.current) return
            e.preventDefault()
            keyRepeatedRef.current = e.code
            action(e)
        }


        function onKeyup(e: KeyboardEvent) {
            //debugger
            console.log(e.code)
            const action = keyCodeActionMap[e.code]
            if (!action ) return
            if ( keyRepeatedRef.current === e.code ) {
                keyRepeatedRef.current = null
                return
            }

            e.preventDefault()
            action(e)
        }

        window.addEventListener('keyup', onKeyup)
        window.addEventListener('keyup', onKeydown)

        return () => {
            window.removeEventListener('keyup', onKeyup)
            window.removeEventListener('keyup', onKeydown)
        }
    }, [keyCodeActionMap, optData])
}


export default useKeypress
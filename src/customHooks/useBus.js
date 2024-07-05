import React from 'react';
import { useEffect } from 'react'

let subscribers = []

const subscribe = (filter, callback) => {
  if (filter   === undefined || filter   === null) return undefined
  if (callback === undefined || callback === null) return undefined

  subscribers = [
    ...subscribers,
    [filter, callback],
  ]

  return () => {
    subscribers = subscribers.filter((subscriber) => subscriber[1] !== callback)
  }
}

export const evDispatch = (event) => {
    //  debugger
    //  console.dir(subscribers)//

    const args   = []
    let { type } = event
    if (typeof event === 'string') {
        type = event
        args.push({ type })
    } else {
        args.push(event)
    }
    //debugger
    console.log(`EVNT: ${type}`, event.payload)//
    // console.trace('ct: ' + event )//

    subscribers.forEach(([filter, callback]) => {
    if (typeof filter === 'string'   &&  filter !== type) return
    if (typeof filter === 'function' && !filter(...args)) return

    callback(...args)
  })
}

export const useBus = (type, callback, deps = []) => {
    useEffect(() => subscribe(type, callback), deps)//eslint-disable-line react-hooks/exhaustive-deps
    return evDispatch
}

export default useBus
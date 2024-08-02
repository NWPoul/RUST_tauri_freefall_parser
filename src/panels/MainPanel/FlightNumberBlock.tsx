


import { cx }                            from "helpers"
import { sendControlInputCommand }       from "API/apiHelpers"

import { IncButtonBlock }                from "components/controls/buttons"

import { getControlInputEventHandler }   from "./serv"
import { useEffect } from "react"



const FLIGHT_TIMEOUT = 30*60*1000
const flightAutoMute = () => {sendControlInputCommand({id: "toggleFlight", val: "false"})}
const toggleFlight = getControlInputEventHandler("toggleFlight")



function useSelfOffFlight(flightN: number, isMuted: boolean) {
    useEffect(()=> {
        let id = null
        if(isMuted === false) { console.log("SET FLIGHT TIMEOUT")
            id = setTimeout(flightAutoMute, FLIGHT_TIMEOUT )
        }
        return () => { console.log("CLEAR FLIGHT TIMEOUT", id)
            if(id) clearTimeout(id)
        }
    }, [flightN, isMuted])
}



export function FlightNumberBlock({
    flightN,
    isMuted,
}:{
    flightN : number,
    isMuted: boolean,

}) {
    useSelfOffFlight(flightN, isMuted)
    const className = cx("flightNBlock", isMuted && "isMuted")

    return (
        <div id="flightNumberBlock" className = {className}>
            <button
                type      = "button"
                className = "quickBtn api_requested-btn"
                onClick   = {toggleFlight}
            >
                ВЗЛЁТ
            </button>

            <IncButtonBlock
                val    = {flightN}
                incVal = {1}
                minVal = {1}
                valUpdateHandler = {
                    (newVal) => sendControlInputCommand({
                        id: "setFlight",
                        val: newVal
                    })
                }
            />
        </div>
    )
}










import { cx }                            from "helpers"
import { sendControlInputCommand }       from "API/apiHelpers"

import { IncButtonBlock }                from "components/controls/buttons"

import { getControlInputEventHandler }   from "./serv"





const toggleFlight = getControlInputEventHandler("toggleFlight")

export function FlightNumberBlock({
    flightN,
    isMuted,
}:{
    flightN : number,
    isMuted: boolean,

}) {
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







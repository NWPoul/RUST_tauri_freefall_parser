


import { cx }                            from "helpers"
import { sendControlInputCommand }       from "API/apiHelpers"

import { IncButtonBlock }                from "components/controls/buttons"

import { getControlInputEventHandler }   from "./serv"
import { useEffect } from "react"



// const flightAutoMute = () => {sendControlInputCommand({id: "toggleFlight", val: "false"})}
const toggleAutoPlay = getControlInputEventHandler("toggleAutoPlay")



export function AutoPlayBtn({
    isMuted,
}:{
    isMuted: boolean,
}) {
    const className = cx("autoPlayBtn", "quickBtn", isMuted && "isMuted")

    return (
            <button
                id        = "autoPlayBtn"
                className = {className}
                type      = "button"
                onClick   = {toggleAutoPlay}
            >
                автопросмотр
            </button>
    )
}







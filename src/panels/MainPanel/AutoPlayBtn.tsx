

import { cx }                            from "helpers"

import { getControlInputEventHandler }   from "./serv"
import { useParsedVideoEvent } from "API/apiHelpers"



const toggleAutoPlay = getControlInputEventHandler("toggleAutoPlay")



export function AutoPlayBtn({isMuted}:{isMuted: boolean}) {
    useParsedVideoEvent()
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







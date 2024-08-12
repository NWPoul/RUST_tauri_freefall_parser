

import { cx }                            from "helpers"
import { useParsedVideoEvent }           from "API/apiHelpers"
import { EyeIcon, FolderCheck, PlayBtnIcon }                   from "assets/SVG_Icons"

import { getControlInputEventHandler }   from "../serv"


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
                {PlayBtnIcon}
                <span>авто</span>
            </button>
    )
}



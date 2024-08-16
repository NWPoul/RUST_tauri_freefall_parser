

import { cx }                            from "helpers"
import { FolderVideoIcon }                   from "assets/SVG_Icons"

import { getControlInputEventHandler }   from "../serv"




const openParserFolder = getControlInputEventHandler("openParserFolder")

export function OpenParsedFolderBtn() {

    const className = cx("openParsedFolderBtn", "quickBtn")

    return (
            <button
                id        = "openParsedFolderBtn"
                className = {className}
                type      = "button"
                onClick   = {openParserFolder}
            >
                {FolderVideoIcon}
            </button>
    )
}



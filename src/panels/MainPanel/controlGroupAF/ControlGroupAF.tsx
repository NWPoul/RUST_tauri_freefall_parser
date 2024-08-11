

import { cx }                            from "helpers"
import { useParsedVideoEvent }           from "API/apiHelpers"
import { FolderCheck }                   from "assets/SVG_Icons"
import { AutoPlayBtn }                   from "./AutoPlayBtn"
import { OpenParsedFolderBtn }           from "./OpenParsedFolderBtn"




export function ControlGroupAF({isAutoPlayMuted}:{isAutoPlayMuted:boolean}) {
    return <div id="controlGroupAF">
        <AutoPlayBtn isMuted={isAutoPlayMuted}/>
        <OpenParsedFolderBtn/>
    </div>
}




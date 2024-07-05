import {
    useWindowLabel,
    initApiStateData,
}                            from './API/apiHelpers'

import { DisplayPanel }      from './panels/DisplayPanel'
import { ControlPanel_V1 }   from './panels/ControlPanel_V1'

initApiStateData()

const PANEL = {
    DISPLAY  : DisplayPanel,
    CONTROL  : ControlPanel_V1,
    // SERV : ControlPanelMini,
}

export function App() {
    const windowLabel = useWindowLabel()?.split("_")?.[0]
    const Panel = windowLabel in PANEL
        ? PANEL[windowLabel as keyof typeof PANEL]
        : null

    return Panel && <Panel/>
}

export default App

import {
    useWindowLabel,
    initApiStateData,
}                         from './API/apiHelpers'

import { MainPanel }      from './panels/MainPanel'

initApiStateData()

const PANEL = {
    MAIN  : MainPanel,
    // SERV : ControlPanelMini,
}

export function App() {
    const windowLabel = useWindowLabel()?.split('_')?.[0]
    const Panel = windowLabel in PANEL
        ? PANEL[windowLabel as keyof typeof PANEL]
        : null

    return Panel && <Panel/>
}

export default App

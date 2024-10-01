import {
    useWindowLabel,
    initApiStateData,
    useRustAppStateUpdateEvent,
    useRustConfigStateUpdateEvent,
}                                           from './API/apiHelpers'

import { MainPanel }                        from './panels/MainPanel'



initApiStateData()

const PANEL = {
    MAIN  : MainPanel,
    // SERV : ControlPanelMini,
} as const

export function App() {
    useRustAppStateUpdateEvent()
    useRustConfigStateUpdateEvent()
    
    const windowLabel = useWindowLabel()?.split('_')?.[0]
    const Panel = windowLabel && windowLabel in PANEL
        ? PANEL[windowLabel as keyof typeof PANEL]
        : null

    return Panel && <Panel/>
}

export default App

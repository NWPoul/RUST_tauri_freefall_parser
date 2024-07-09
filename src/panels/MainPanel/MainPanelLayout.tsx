
import {
    useKeys,
    apiSetStatus,
    apiSetAddress,
    apiSetFlasherPort,
    apiPushValues,
}                                        from './serv'

import { ApiValuesInputBlock }           from './ApiValuesInputBlock'

import type { T_apiSystemState }         from 'API/apiSystemStore'
import type { T_QCTIMER_STATE }          from 'panels/controls/types'



function FlasherPortSelect({ sys_config }:{
    sys_config: T_apiSystemState["sys_config"]
 }) {
    const serialPortsOptions = sys_config?.serial_ports.map(port => {
        return <option key={port}
            value={port}
            className="api_flasherPort-option"
        >
            {port}
        </option>
    })

    return <select id="api_flasherPort-select"
        name      = "flasher_port"
        className = "quickBtn api_flasherPort-btn"
        value     = { sys_config?.flasher_port }
        onChange  = { apiSetFlasherPort }
    >
        {serialPortsOptions}
    </select>
}

function ApiAddrSelect({ sys_config }:{
    sys_config: T_apiSystemState["sys_config"]
 }) {
    return <select id="api_addr-select"
        name      = "api_addr"
        className = "quickBtn api_addr-btn"
        value     = { sys_config?.api_addr }
        onChange  = { apiSetAddress }
    >
        <option value="PROD"   className="api_addr-option">PROD</option>
        <option value="DEV"    className="api_addr-option">DEV</option>
        <option value="DIRECT" className="api_addr-option">DIRECT</option>
    </select>
}



export function MainPanelLayout({
    QCTIMER_STATE,
    SYTSTEM_STATE,
}:{
    QCTIMER_STATE : T_QCTIMER_STATE,
    SYTSTEM_STATE : T_apiSystemState,
}) {
    useKeys()

    const className  = `controls_wrapper ${QCTIMER_STATE.isPlaying ? ' playing' : ''}`
    const sys_config = SYTSTEM_STATE.sys_config


    return <div className={className}>
        <div className="mainBtnBlock">
            <button
                type      = "button"
                className = "quickBtn api_requested-btn"
                onClick   = { () => apiSetStatus(!sys_config?.api_requested) }
            >
                API {sys_config?.api_requested ? "ACTIVE" : "STOPPED"}
            </button>

            <ApiAddrSelect sys_config={sys_config}/>

            <FlasherPortSelect sys_config={sys_config}/>

            <ApiValuesInputBlock
                 onValueChange = {
                    (values: number[]) =>{ apiPushValues(values) }
                }
            />
        </div>
        {/* <TestBtn testF = {testF}/> */}
    </div>;
}

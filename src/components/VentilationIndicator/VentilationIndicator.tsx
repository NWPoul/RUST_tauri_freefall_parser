import {
    useApiSystemStore,
    API_SYSTEM_SELECTORS,
    WRONG_VENT_VAL,
    DEFAULT_VENT_CONFIG,
}                               from 'API/apiSystemStore'
import { IconInlet, IconVanes } from 'assets/SVG_Icons'

import './ventilationIndicator.css'



const WRONG_VENT_INDICATION = `...`

const InletLabel  = <div className="ventIcon">{IconInlet}</div>
const VanesLabel  = <div className="ventIcon">{IconVanes}</div>



export function VentilationIndicator() {
    const ventConfig = useApiSystemStore(API_SYSTEM_SELECTORS.ventilation) ?? DEFAULT_VENT_CONFIG
    console.log('ventConfig: ', ventConfig)
    const inletVal = ventConfig.inlet === WRONG_VENT_VAL ? WRONG_VENT_INDICATION : ventConfig.inlet
    const vanesVal = ventConfig.vanes === WRONG_VENT_VAL ? WRONG_VENT_INDICATION : ventConfig.vanes

    let ventClassName = "ventClass"

    return (
        <div
            className={`VentilationIndicator ${ventClassName}`}
        >
            <div className="vent-inlet">
                {/* СТВОРКИ */}
                {InletLabel}
                <span className="vent-value">&nbsp;{inletVal}&nbsp;</span>
            </div>

            <div className="vent-vanes">
                {/* СЕКЦИЯ */}
                {VanesLabel}
                <span className="vent-value">&nbsp;{vanesVal}&nbsp;</span>
            </div>
        </div>
    )
}


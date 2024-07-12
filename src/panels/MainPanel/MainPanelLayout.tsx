
import {
    useKeys,
}                                        from './serv'

import type { T_apiAppState }            from 'API/apiAppStore'
import type { T_apiConfigState }         from 'API/apiConfigStore'




export function MainPanelLayout({
    APP_STATE,
    CONFIG_STATE,
}:{
    APP_STATE    : T_apiAppState,
    CONFIG_STATE : T_apiConfigState,
}) {
    useKeys()

    const className  = `controls_wrapper`


    return <div className={className}>
        <div className="mainBtnBlock">
            <button
                type      = "button"
                className = "quickBtn api_requested-btn"
                onClick   = {void null}
            >
                BTN
            </button>
        </div>
        {/* <TestBtn testF = {testF}/> */}
    </div>;
}

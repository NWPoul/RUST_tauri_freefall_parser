
import {
    useKeys,
}                                        from './serv'

import { sendControlInputCommand }       from "API/apiHelpers";

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

    function openFiles() {
        sendControlInputCommand(
            {
                id: "openFiles",
                val: "",
            }
        )
        console.log('openFilesBtn')
    }


    return <div className={className}>
        <div className="mainBtnBlock">
            <button
                type      = "button"
                className = "quickBtn api_requested-btn"
                onClick   = {openFiles}
            >
                Выбрать файлы
            </button>
        </div>
        {/* <TestBtn testF = {testF}/> */}
    </div>;
}

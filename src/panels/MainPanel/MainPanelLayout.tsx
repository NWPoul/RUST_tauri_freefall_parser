
import {
    useKeys,
}                                        from './serv'

import { sendControlInputCommand }       from "API/apiHelpers";

import type { T_apiAppState }            from 'API/apiAppStore'
import type { T_apiConfigState }         from 'API/apiConfigStore'



function openFiles() {
    sendControlInputCommand(
        {
            id: "openFiles",
            val: "",
        }
    )
    console.log('openFilesBtn')
}



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
                // onClick   = {openFiles}
            >
                freefall {-CONFIG_STATE.time_start_offset}
            </button>

            <button
                type      = "button"
                className = "quickBtn api_requested-btn"
                // onClick   = {openFiles}
            >
                Камерамен
            </button>

            <button
                type      = "button"
                className = "quickBtn api_requested-btn"
                // onClick   = {openFiles}
            >
                ВЗЛЁТ: 
            </button>

            <br/>




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

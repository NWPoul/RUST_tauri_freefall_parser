import { API_minimizeWindow }                from 'API/api'
import { HeadDownIcon } from 'assets/SVG_Icons'



const AppHeader = () => {
    return (
        <div id="appHeader" data-tauri-drag-region>
            <div id="appHeader-left">
                <div id="appHeaderIconDiv" data-tauri-drag-region>{HeadDownIcon}</div>
                <span data-tauri-drag-region>NW FF parser</span>
            </div>
            <div className="appHeader-controls">
                <button id="appHeaderMinimizeBtn"
                    onClick={API_minimizeWindow}
                >
                    _
                </button>
            </div>
        </div>
    )
}



export {
    AppHeader,
}

export default AppHeader
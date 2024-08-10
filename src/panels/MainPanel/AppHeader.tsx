import { API_minimizeWindow }                from 'API/api'



const AppHeader = () => {
    return (
        <div id="appHeader" data-tauri-drag-region>
            <span>NW FF parser</span>
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
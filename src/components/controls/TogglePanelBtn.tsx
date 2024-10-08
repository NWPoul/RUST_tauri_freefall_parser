import {
    // sendControlInputCommand,
    // sendSystemInputCommand,
    WINDOW_CONFIG,
    sendTogglePanelCommand,
    type WindowOptions
}                                   from 'API/apiHelpers'


// const controls   = getControls(appState)
export function TogglePanelBtn({ label, config, text }: { label: string; config?: WindowOptions; text: string; }) {
    config ??= WINDOW_CONFIG[label as keyof typeof WINDOW_CONFIG]
    const toggleHandler = () => sendTogglePanelCommand(label, config)

    return <button
        className='quickBtn togglePanel-btn'
        onClick={toggleHandler}
    >
        {text}
    </button>
}


export function TogglePanelBtnBlock() {
    return <div id="panelBtn-wrapper">
        <TogglePanelBtn
            label = {'CONTROL'}
            text  = 'CP'
        />
        <TogglePanelBtn
            label = {'DISPLAY'}
            text  = 'DP'
        />
    </div>
}
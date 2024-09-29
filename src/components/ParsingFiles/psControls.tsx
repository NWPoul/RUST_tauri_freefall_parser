import { getControlInputEventHandler } from 'panels/MainPanel/serv'



const clearChosenFiles = getControlInputEventHandler('clearChosenFiles')


export function PsControls() {
    return <div id='PsControls'
        className="psControls"
    >
        <button className="pscontrols-parseBtn">Парсить</button>
        <button
            className = "pscontrols-closeBtn"
            onClick   = {clearChosenFiles}
        >
            Закрыть
        </button>
    </div>
}
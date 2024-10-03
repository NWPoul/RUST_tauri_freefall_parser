import { T_InternalFileData }                   from './ParsingFiles'




export function FileRow(props: T_InternalFileData) {
    const operator = props.operator || 'NOT SET'
    const flight   = props.flight || 'NOT SET'
    const fileName = props.scrPath.substr(props.scrPath.lastIndexOf('\\')+1)
cl
    return <div className="FileRow">
        <div className="FileRow-cell operator">
            {operator}
        </div>
        <div className="FileRow-cell camModel">
            {props.camModel}
        </div>
        <div className="FileRow-cell flight">
            FLIGHT_{flight}
        </div>
        <div className="FileRow-cell srcName">{fileName}</div>
        <div className="FileRow-cell srcName">--</div>
        <div className="FileRow-cell time">
            {props.stTime}-{props.endTime}
        </div>
    </div>
}
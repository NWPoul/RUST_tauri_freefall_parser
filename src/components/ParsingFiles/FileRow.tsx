import type { T_FileOkRec } from 'API/apiAppStore'


type T_fileProps = {
    fileName  :  string
    fileData  :  T_FileOkRec[1]
    operator  ?: string
    flight    ?: number
}



export function FileRow(props: T_fileProps) {
    const operator = props.operator || props.fileData.cam_info.serial || 'NOT SET'
    const flight   = props.flight || 'NOT SET'
    const fileName = props.fileName.substr(props.fileName.lastIndexOf('\\')+1)

    return <div className="FileRow">
        <div className="FileRow-cell operator">
            {operator}
        </div>
        <div className="FileRow-cell camModel">
            {props.fileData.cam_info.model}
        </div>
        <div className="FileRow-cell flight">
            FLIGHT_{flight}
        </div>
        <div className="FileRow-cell srcName">{fileName}</div>
        <div className="FileRow-cell srcName">--</div>
        <div className="FileRow-cell time">
            {props.fileData.start_time}-{props.fileData.end_time}
        </div>
    </div>
}
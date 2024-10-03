import { useEffect, useState }          from 'react'


import { sendControlInputCommand }      from 'API/apiHelpers'

import { configStore }                  from 'API/apiConfigStore'

import {
    useAppState,
    type T_ChosenFiles,
    type T_FileOkRec,
    type T_FileErrRec,
    type T_apiAppState,
}                                       from 'API/apiAppStore'

import { FileRow }                      from './FileRow'
import { PsControls }                   from './psControls'

import './styles.css'



type T_FileToFFmpegData = {
    scr_path: string,
    out_path: string,
    st_time : number,
    end_time: number,
}

export type T_InternalFileData = {
    toParse : boolean,
    scrPath : string,
    outPath : string,
    stTime  : number,
    endTime : number,
    camModel: string,
    flight  : number | null,
    operator: string | null,
}


const testVal = {
    scr_path: 'testSrc',
    out_path: 'teestOut',
    st_time : 10,
    end_time: 60,
} satisfies T_FileToFFmpegData

const testFfmpgefiles = (val: T_FileToFFmpegData[]) => {
    sendControlInputCommand({
        id : 'ffmpegChosenFiles',
        val: JSON.stringify(val),
    })
}

const useChosenFiles = (
    inGooddata: T_FileOkRec[]  | [],
    inErrData : T_FileErrRec[] | [],
) => {
    const [goodFilesData, setGoodFilesData] = useState<T_FileOkRec[]>()
    const [errFilesData , setErrFilesData]  = useState<T_FileErrRec[]>()

    useEffect(() => {
        setGoodFilesData(inGooddata)
    }, [inGooddata])

    useEffect(() => {
        setErrFilesData(inErrData)
    }, [inErrData])
}


function getInternalFileData(appState: T_apiAppState) {
    const isValidFilesData =  appState.chosen_files_data?.some(arr => arr.length > 0)
    const chosenFilesData =  isValidFilesData
        ?   appState.chosen_files_data
        :   null


    const internalFilesData = chosenFilesData?.[0].map( ([scrPath, fileData]) => {
        const res = {
            scrPath,
            toParse : true,
            outPath : '',
            stTime  : fileData.start_time,
            endTime : fileData.end_time,
            camModel: fileData.cam_info.model,
            flight  : appState.flight,
            operator: 'OP_ID',
        } satisfies T_InternalFileData

        return res
    })
    return internalFilesData || null
}



export function ParsingFiles({appState}:{appState: T_apiAppState}) {
    const configState = configStore.use()

    

    if (   appState.chosen_files_data === null
        || appState.chosen_files_data.every(arr => arr.length === 0)
    ) return 'NO FILES CHOSEN'

    const internalFilesData = getInternalFileData(appState)

    const goodJSX = internalFilesData?.map(
        fileData => <FileRow key={fileData.scrPath}
            {...fileData}
        />
    ) || null


    const testClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        console.log(e)
        testFfmpgefiles([testVal])
    }

    return (
        <div className='ParsingFiles'>
            {goodJSX}
            <PsControls/>
            <button
                value={JSON.stringify(testVal)}
                onClick={testClick}
            >
                TEST
            </button>
        </div>
    )
}
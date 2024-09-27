// import { useState } from 'react'

import type { T_ChosenFiles, T_FileOkRec, T_FileErrRec }       from 'API/apiAppStore'

import './styles.css'
import { FileRow } from './FileRow'
import { PsControls } from './psControls'



export function ParsingFiles({chosenFiles}:{chosenFiles: T_ChosenFiles | null}) {
    // const [value, setValue] = useState('')

    if (chosenFiles === null || chosenFiles.every(arr => arr.length === 0)) {
        return 'NO FILES CHOSEN'
    }

    const good_files = chosenFiles[0]
    const GoodJSX = good_files.length === 0 ? null : good_files.map(
        ([fileName, fileData]) => <FileRow key={fileName}
            fileName={fileName}
            fileData={fileData}
            flight={1}
            // operator  ?: string
        />
    )

    return (
        <div className='ParsingFiles'>
            {GoodJSX}
            <PsControls/>
        </div>
    )
}
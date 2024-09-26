// import { useState } from 'react'

import type { T_ChosenFiles, T_FileOkRec, T_FileErrRec }       from 'API/apiAppStore'

import './styles.css'
import { FileRow } from './FileRow'



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
            // operator  ?: string
            flight={1}
        />
    )

    return (
        <div className='ParsingFiles'>
            {GoodJSX}
        </div>
    )
}
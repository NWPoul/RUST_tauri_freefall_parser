import { secTo_MMSS_String } from 'helpers'
import { T_timeblocks }      from 'panels/controls'


type T_TimeblocksListProps = {
    timeblocks     :T_timeblocks;
    onlyDifferNext?:boolean;
}

export const TimeblocksList = ({ timeblocks, onlyDifferNext = false }:T_TimeblocksListProps) => {
    const cur  = secTo_MMSS_String(timeblocks.cur)
    const next = secTo_MMSS_String(timeblocks.next)

    const loopIndicator = timeblocks.loop ? 'в цикле' : null
    const nextBlockJSX  = !next && onlyDifferNext
        ?   null
        :   <>
                {next && (next !== cur) ? '⇒'
                        : onlyDifferNext ? null : '⇒'
                }
                <span className={`tbi tbi-block tbi-next ${next ? "": "tbi-next-null"}`}>
                    {next && (next !== cur) ? next
                        : onlyDifferNext ? null
                            : cur
                    }
                </span>
            </>

    return <div
        className='timeblocksList'
    >
        <span className='tbi tbi-header'>Таймблок</span>
        <div className='tbi-curnextWrapper'>
            <span className='tbi tbi-block tbi-now'>
                {cur || null}
            </span>
            { nextBlockJSX }
        </div>
        <span className='tbi tbi-loopIndicator'>
            {loopIndicator}
        </span>

    </div>
}

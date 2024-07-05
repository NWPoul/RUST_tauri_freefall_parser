import { useRustSystemStateUpdateEvent } from 'API/apiHelpers'

import {
    useApiSystemStore,
    API_SYSTEM_SELECTORS,
    WRONG_SPEED_VAL,
}                                        from 'API/apiSystemStore'


import {
    ArrowUp,
    DoubleArrowUp,
}                                        from 'assets/SVG_Icons'

import './speedIndicator.css'

type T_speedDiffDirection = "UP"|"DOWN"|""
type T_speedDiffLevel     = keyof typeof SPEED_DIFF_LEVEL
type T_speedDiffObj       = {
    val      : number,
    level    : T_speedDiffLevel,
    direction: T_speedDiffDirection,
}

const WRONG_SPEED_INDICATION = `...`

const SPEED_DIFF_LEVEL = {
    MIN : 1,
    LOW : 5,
    MID : 10,
    HIGH: 100,
} as const



function validateSpeedVal(speedVal = WRONG_SPEED_VAL) {
    if (speedVal < 0)   { speedVal = WRONG_SPEED_VAL }
    if (speedVal > 100) { speedVal = 100 }
    return speedVal
}

function splitIntFractPart(speedVal: number) {
    const intPart = Math.trunc(speedVal)
    const decPart = ((speedVal % 1)*10).toFixed(0)
    return [intPart, decPart] as const
}

function getSpeedDiffObj(speedSetVal: number, speedActVal: number) {
    const diff    = speedSetVal - speedActVal
    const absDiff = Math.abs(diff)

    const diffObj:  T_speedDiffObj = {
        val       : absDiff,
        level     : "MIN",
        direction : "",
    }

    if (absDiff <= SPEED_DIFF_LEVEL.MIN) {
        diffObj.val = 0
        return diffObj
    }

    diffObj.direction = diff > 0 ? "UP" : "DOWN"

    if      (absDiff > SPEED_DIFF_LEVEL.MID) {diffObj.level = "HIGH"}
    else if (absDiff > SPEED_DIFF_LEVEL.LOW) {diffObj.level = "MID"}
    else    {diffObj.level = "LOW"}

    return diffObj
}



const SpeedDiffIndicator = ({
    speedDiffObj,
    speedActValTrunc
}: {
    speedDiffObj: T_speedDiffObj,
    speedActValTrunc: number
}) => {
    const arrow = speedDiffObj.level === 'LOW'
        ? ArrowUp
        : DoubleArrowUp

    const className = `${speedDiffObj.level}-diff ${speedDiffObj.direction}-diff`

    return <div id="SpeedDiffIndicator" className={className}>
        <div id="diffActSpeed" className={className}>
            {speedActValTrunc}
            <span className="diffActSpeed-percent">%</span>
        </div>
        {arrow}
    </div>
}



export function KmIndicator({speedActVal, speedSetVal}:{speedActVal: number, speedSetVal: number}) {
    const speedKmVal   = Math.trunc(speedActVal*3)
    const speedDiffObj = getSpeedDiffObj(speedSetVal, speedActVal)

    let diffClassMod = speedDiffObj.level === "MIN"
        ? ""
        : `${speedDiffObj.level}-diff ${speedDiffObj.direction}-diff`

    const className = 'speedKm_wrapper ' + diffClassMod


    return (
        speedKmVal >= 3 &&
        <div className = {className}>
            { speedDiffObj.level !== "MIN"
                ? <>
                    <SpeedDiffIndicator
                        speedDiffObj     = {speedDiffObj}
                        speedActValTrunc = {Math.trunc(speedActVal)}
                    />
                </>
            
                : <>
                    <span className="speedKm_val">{speedKmVal}</span>
                    <div className="speedKm_units">
                        <div className="speedKm_units-km">км</div>
                        <div className="speedKm_units-h">ч</div>
                    </div>
                </>
            }
        </div>
    )
}


export function PercentIndicator({speedSetValPercent}:{speedSetValPercent: number}) {
    const [intPart, decPart] = splitIntFractPart(speedSetValPercent)

    let speedClassName
    if      (speedSetValPercent < 70) { speedClassName = 'lowSpeed'}
    else if (speedSetValPercent < 85) { speedClassName = 'mediumSpeed'}
    else    { speedClassName = 'highSpeed'}

    return (
        <div className={`PercentIndicator ${speedClassName}`}>
            <span className="PercentIndicator-int">{intPart}</span>
            {speedSetValPercent < 100 && speedSetValPercent > 0 && <span className="PercentIndicator-dec">.{decPart}</span>}
            <span className="PercentIndicator-percent">%</span>
        </div>
    )
}



export function SpeedIndicator() {
    useRustSystemStateUpdateEvent()
    let speedSetVal = validateSpeedVal(useApiSystemStore(API_SYSTEM_SELECTORS.speedSet))
    let speedActVal = validateSpeedVal(useApiSystemStore(API_SYSTEM_SELECTORS.speedAct))

    console.log('speedSetVal: ', speedSetVal)
    if (speedSetVal === WRONG_SPEED_VAL) {
        return <div className="SpeedIndicator errSpeed">{WRONG_SPEED_INDICATION}&nbsp;</div>
    }

    return (
        <div
            className={`SpeedIndicator`}
        >
            <KmIndicator speedActVal={speedActVal} speedSetVal={speedSetVal}/>
            <PercentIndicator speedSetValPercent={speedSetVal}/>
        </div>)
}


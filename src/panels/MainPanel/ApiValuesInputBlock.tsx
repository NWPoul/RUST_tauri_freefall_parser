import { useState }                  from 'react'
import { useThrottle }               from 'customHooks'
import type { T_apiSystemState }     from 'API/apiSystemStore'



type T_ApiValuesInputBlockProps = {
    onValueChange: (values: number[]) => void,
    curApiState?: T_apiSystemState,
}

type T_ChangeHandlerProps = {
    setSpeedVal: number
    actSpeedVal: number
    inletVal   : number
    vanesVal   : number
    localStateThrottle: (values: number[]) => void
    apiStateThrottle  : (values: number[]) => void
}


function _percent_to_regSpeedVal (value: number): number {
    const regVal = Math.round(value /1000 * 16384)
    return regVal
}


function getChangeHandler({
    setSpeedVal,
    actSpeedVal,
    inletVal,
    vanesVal,
    localStateThrottle,
    apiStateThrottle,
} : T_ChangeHandlerProps
) {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
        const inputIds   = ['speed_set', 'speed_act', 'inletVal', 'vanesVal']
        const inputId    = event.currentTarget.id
        const inputIndex = inputIds.indexOf(inputId)
        if (inputIndex === -1) return

        const newValues = [setSpeedVal, actSpeedVal, inletVal, vanesVal]
        const newValue  = parseInt(event.target.value, 10)
        newValues[inputIndex] = newValue

        const newRegValues = newValues.map( (val, i) => i < 2
            ? _percent_to_regSpeedVal(val)
            : val
        )

        localStateThrottle(newValues)
        apiStateThrottle(newRegValues)
    }
}



export const ApiValuesInputBlock: React.FC<T_ApiValuesInputBlockProps> = ({
    onValueChange, curApiState,
}) => {
    const minSpeedVal  = 0
    const maxSpeedVal  = 1010
    // const speedValStep = Math.floor(maxSpeedVal / 1000)
    const speedValStep = maxSpeedVal / 1000

    const minVentVals  = -3
    const maxInletVal  = 5
    const maxVanesVal  = 12
    const ventValsStep = 1

    const [setSpeedVal, setSetSpedVal ] = useState<number>(minSpeedVal)
    const [actSpeedVal, setActSpedVal ] = useState<number>(minSpeedVal)
    const [inletVal, setinletVal ]      = useState<number>(0)
    const [vanesVal, setvanesVal ]      = useState<number>(0)


    const localStateThrottle = useThrottle(
        (newValues: number[]|[number,number]) => {
            setSetSpedVal(newValues[0])
            setActSpedVal(newValues[1])
            setinletVal(newValues[2])
            setvanesVal(newValues[3])
        },
        50
    )
    const apiStateThrottle   = useThrottle(
        (newValues: number[]) => {
            onValueChange(newValues)
        },
        100
    )

    const handleSliderChange = getChangeHandler({
        setSpeedVal,
        actSpeedVal,
        inletVal,
        vanesVal,
        localStateThrottle,
        apiStateThrottle,
    })


    return (
        <div className="push-api-inputs-block">
            <div className="slider-wrapper setspeed-slider quickBtn">
                <div className='slider-label' >
                    <span className='slider-label-text'>set speed:</span>
                    <span className='slider-label-val'>{setSpeedVal/10}</span>
                </div>
                <input id="speed_set" type='range'
                    className="custom-slider"
                    min={minSpeedVal}
                    max={maxSpeedVal}
                    step={speedValStep}
                    value={setSpeedVal}
                    onChange={handleSliderChange} />
            </div>

            <div className="slider-wrapper actSpeed-slide quickBtn">
                <div className='slider-label' >
                    <span className='slider-label-text'>act speed:</span>
                    <span className='slider-label-val'>{actSpeedVal/10}</span>
                </div>
                <input id="speed_act" type='range'
                    className="custom-slider"
                    min={minSpeedVal}
                    max={maxSpeedVal}
                    step={speedValStep}
                    value={actSpeedVal}
                    onChange={handleSliderChange} />
            </div>

            <div className="slider-wrapper inletVal-slider quickBtn">
                <div className='slider-label' >
                    <span className='slider-label-text'>inlet:</span>
                    <span className='slider-label-val'>{inletVal}</span>
                </div>
                <input id="inletVal" type='range'
                    className="custom-slider"
                    min={minVentVals}
                    max={maxInletVal}
                    step={ventValsStep}
                    value={inletVal}
                    onChange={handleSliderChange} />
            </div>

            <div className="slider-wrapper vanesVal-slider quickBtn">
                <div className='slider-label' >
                    <span className='slider-label-text'>vanes:</span>
                    <span className='slider-label-val'>{vanesVal}</span>
                </div>
                <input id="vanesVal" type='range'
                    className="custom-slider"
                    min={minVentVals}
                    max={maxVanesVal}
                    step={ventValsStep}
                    value={vanesVal}
                    onChange={handleSliderChange} />
            </div>
        </div>
    )
}



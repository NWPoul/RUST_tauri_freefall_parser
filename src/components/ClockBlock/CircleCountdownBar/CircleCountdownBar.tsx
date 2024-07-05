import { getParamsForSVG }   from './utils'
import type { Props }        from './types'



const CircleCountdownBar = (props: Props) => {
    const { strokeLinecap, trailColor, trailStrokeWidth } = props
    const {
        path,
        pathLength,
        stroke,
        strokeDashoffset,
        size,
        strokeWidth,
    } = getParamsForSVG(props)

    return <svg xmlns="http://www.w3.org/2000/svg"
        viewBox={`0 0 ${size} ${size}`}
        width={size}
        height={size}
    >
        <path
            d={path}
            fill="none"
            stroke={trailColor ?? '#d9d9d9'}
            strokeWidth={trailStrokeWidth ?? strokeWidth}
        />
        <path
            d={path}
            fill="none"
            stroke={stroke}
            strokeLinecap={strokeLinecap ?? 'round'}
            strokeWidth={strokeWidth}
            strokeDasharray={pathLength}
            strokeDashoffset={strokeDashoffset}
        />
    </svg>
}

CircleCountdownBar.displayName = 'CircleCountdownBar'

export { CircleCountdownBar }

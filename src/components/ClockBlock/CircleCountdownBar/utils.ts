import type {
    Props,
    ColorFormat,
    // ColorRGB,
}                        from './types'



const getPathProps = (
    size: number,
    strokeWidth: number,
    rotation: 'clockwise' | 'counterclockwise'
) => {
    const halfSize = size / 2
    const halfStrokeWith = strokeWidth / 2
    const arcRadius = halfSize - halfStrokeWith
    const arcDiameter = 2 * arcRadius
    const rotationIndicator = rotation === 'clockwise' ? '1,0' : '0,1'

    const pathLength = 2 * Math.PI * arcRadius
    const path = `m ${halfSize},${halfStrokeWith} a ${arcRadius},${arcRadius} 0 ${rotationIndicator} 0,${arcDiameter} a ${arcRadius},${arcRadius} 0 ${rotationIndicator} 0,-${arcDiameter}`

    return { path, pathLength }
}

const linearEase = (
    time: number,
    start: number,
    goal: number,
    duration: number,
    isGrowing: boolean
) => {
    if (duration === 0) return start

    const currentTime = (isGrowing ? duration - time : time) / duration
    return start + goal * currentTime
}


const getRGB = (color: string) =>
    color
        .replace(
            /^#?([a-f\d])([a-f\d])([a-f\d])$/i,
            (m, r, g, b) => `#${r}${r}${g}${g}${b}${b}`
        )
        .substring(1)
        .match(/.{2}/g)
        ?.map((x) => parseInt(x, 16)) ?? []


const getStroke = (props: Props, remainingTime: number): ColorFormat => {
    const { colors, colorsTime, isSmoothColorTransition = true } = props
    if (typeof colors === 'string') return colors

    const index =
        colorsTime?.findIndex(
            (time, i) => time >= remainingTime && remainingTime >= colorsTime[i + 1]
        ) ?? -1

    if (!colorsTime || index === -1) return colors[0]

    if (!isSmoothColorTransition) return colors[index]

    const currentTime = colorsTime[index] - remainingTime
    const currentDuration = colorsTime[index] - colorsTime[index + 1]
    const startColorRGB = getRGB(colors[index])
    const endColorRGB = getRGB(colors[index + 1])
    const isGrowing = !!props.isGrowing

    return `rgb(${startColorRGB
        .map(
            (color, index) =>
                linearEase(
                    currentTime,
                    color,
                    endColorRGB[index] - color,
                    currentDuration,
                    isGrowing
                ) | 0
        )
        .join(',')})`
}



export const getParamsForSVG = (props: Props) => {
    const {
        duration,
        elapsedTime,
        size = 180,
        strokeWidth = 12,
        trailStrokeWidth,
        // isPlaying = false,
        isGrowing = false,
        rotation = 'clockwise',//'clockwise','counterclockwise'
    } = props
    const maxStrokeWidth = Math.max(strokeWidth, trailStrokeWidth ?? 0)
    const { path, pathLength } = getPathProps(size, maxStrokeWidth, rotation)
    const remainingTimeRow = duration - elapsedTime

    return {
        path,
        pathLength,
        rotation,
        size,
        stroke: getStroke(props, remainingTimeRow),
        strokeDashoffset: linearEase(
            elapsedTime,
            0,
            pathLength,
            duration,
            isGrowing
        ),
        strokeWidth,
    }
}

// const getIsColorBetweenColors = (
//     color: ColorRGB,
//     start: ColorRGB,
//     end: ColorRGB
// ) => {
//     const getIsInRange = (x: number, min: number, max: number) =>
//         (x - min) * (x - max) <= 0

//     const getRGB = (color: ColorRGB): number[] =>
//         color
//             .match(/(\d+),(\d+),(\d+)/)!
//             .splice(1, 4)
//             .map((c: string) => parseInt(c, 10))

//     const colorRGB = getRGB(color)
//     const startRGB = getRGB(start)
//     const endRGB = getRGB(end)

//     return colorRGB.every((c, index) =>
//         getIsInRange(c, startRGB[index], endRGB[index])
//     )
// }
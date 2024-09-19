

import { cx }                            from 'helpers'
import { PlayBtnIcon }                   from 'assets/SVG_Icons'

import { getControlInputEventHandler }   from '../serv'


const toggleAutoPlay = getControlInputEventHandler('toggleAutoPlay')



export function AutoPlayBtn({isMuted}:{isMuted: boolean}) {
    const className = cx('autoPlayBtn', 'quickBtn', isMuted && 'isMuted')

    return (
            <button
                id        = "autoPlayBtn"
                className = {className}
                type      = "button"
                onClick   = {toggleAutoPlay}
            >
                {PlayBtnIcon}
                <span>авто</span>
            </button>
    )
}



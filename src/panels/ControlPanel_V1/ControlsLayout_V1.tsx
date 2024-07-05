import { useState } from 'react'

import { T_longPressEventHandlers }      from 'customHooks'
import { T_appTimerStateMsg }            from 'API/apiTimerStore'

import { TimeblocksList }                from 'components/TimeblocksList'

import {
    QuickButton,
    CustomButton,
    IncButton,
    PauseButton,
    NextButton,
    RestartButton,
    CycleButton,
    MessageBtn,
}                                        from '../controls/buttons'

import {
    CustomMessageBtn,
    AlertMessageBtn,
    HelmetMessageBtn,
}                                        from '../controls/messageServ'

import type {
    T_timeblocks,
    T_QCTIMER_STATE,
}                                        from '../controls/types'

import './controls_styles_V1.css'



export function ControlsLayoutV1({
    QCTIMER_STATE,
    longPressEvent,
    onIncBtnClick,
    messageUpdate,
}:{
    QCTIMER_STATE : T_QCTIMER_STATE,
    longPressEvent: T_longPressEventHandlers,
    onIncBtnClick : T_longPressEventHandlers,
    messageUpdate : (msg: string|T_appTimerStateMsg) => void,
}) {
    const className=`controls_wrapper ${QCTIMER_STATE.isPlaying ? ' playing' : ''}`
    const timeblocks:T_timeblocks = QCTIMER_STATE.timeblocks

    const [isNumpad, setIsNumpad] = useState(false)

    return <div
        className={className}
        {...longPressEvent()}
    >
        <TimeblocksList timeblocks={timeblocks}/>
        <div className="servControlsBlock">
            <div className="top-right-block">
                {/* {isMenu
                    ? <Menu    isMenu={isMenu} setIsMenu={setIsMenu} />
                    : <MenuBtn isMenu={isMenu} setIsMenu={setIsMenu} />
                } */}
                {/* isSettingsMenu={isSettingsMenu} setIsSettingsMenu = {setIsSettingsMenu}/>} */}
                {/* {isSettingsMenu && <SettingsMenu setIsSettingsMenu = {setIsSettingsMenu} />} */}
            </div>
            <div className="messageBtnBlock">
                <div id="messageServBtnBlock" className="messageServBtnBlock">
                    <CustomMessageBtn  updMessage={messageUpdate}>...</CustomMessageBtn>
                    <HelmetMessageBtn  updMessage={messageUpdate}>№ ...</HelmetMessageBtn>
                    <AlertMessageBtn   updMessage={messageUpdate}>&#9888;</AlertMessageBtn>
                </div>
                <div className="clearBtn">
                    <MessageBtn
                        innerText="✖"
                        messageId={'CLEAR'} />
                </div>
                <div className="messageTNLBtnBlock">
                    <MessageBtn
                        // innerText={`" T "\n\r taxi `}
                        innerText={`TAXI`}
                        messageId={'TAXI'} />
                    <MessageBtn
                        // innerText={`" N "\n next`}
                        innerText={`Next`}
                        messageId={'NEXT_L'} />
                    <MessageBtn
                        // innerText={`" L "\n last `}
                        innerText={`LAST`}
                        messageId={'LAST'} />
                </div>
            </div>
        </div>

        <div className="middleControlBlock">
            <CustomButton
                hotKey='7'
                timeblocks={timeblocks}
                layout='ROW'
            />
            <div className="nextResetBtnBlock">
                <RestartButton />
                <NextButton />
                <CycleButton
                    isCycle={timeblocks.loop}
                    isActive={
                        timeblocks.loop
                        || !!timeblocks.next && !!timeblocks.cur && timeblocks.next !== timeblocks.cur
                    }
                />
            </div>
        </div>

        <div className="mainBtnBlock">
            <div className="mainBtnBlock-left">
                <div className="qBTnSlot">
                    <QuickButton
                        timeVal={1 * 60 + 30}
                        hotKey='2'
                        timeblocks={timeblocks}
                    >1.5</QuickButton>
                    <QuickButton
                        timeVal={1 * 60}
                        hotKey='1'
                        timeblocks={timeblocks}
                    >{'1\u2032'}</QuickButton>
                </div>
                <div className="qBTnSlot">
                    <QuickButton
                        timeVal={2 * 60 + 30}
                        hotKey='4'
                        timeblocks={timeblocks}
                    >2.5</QuickButton>
                    <QuickButton
                        timeVal={2 * 60}
                        hotKey='3'
                        timeblocks={timeblocks}
                    >{'2\u2032'}</QuickButton>
                </div>
                <div className="qBTnSlot">
                    <QuickButton
                        timeVal={5 * 60}
                        hotKey='6'
                        timeblocks={timeblocks}
                    >{'5\u2032'}</QuickButton>
                    <QuickButton
                        timeVal={3 * 60}
                        hotKey='5'
                        timeblocks={timeblocks}
                    >{'3\u2032'}</QuickButton>
                </div>
            </div>

            <div className="mainBtnBlock-right">
                <div className="incrementBtnBlock" {...onIncBtnClick()}>
                    <IncButton timeVal={-5} />
                    <IncButton timeVal={ 5} />
                </div>
                <PauseButton isPlaying={QCTIMER_STATE.isPlaying} />
            </div>
        </div>
    </div>
}

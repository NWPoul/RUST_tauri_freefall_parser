import { ReactNode, useMemo, useState } from 'react'
import { Numpad }                       from 'components/Numpad'

import type { T_appTimerStateMsg }      from 'API/apiTimerStore'
// import { T_repeatableLongPressEvent } from 'customHooks'

// import type { T_controlActions } from 'components/Controls/controlsCore'
export type T_updMessage = (args: string  | T_appTimerStateMsg) => void|undefined
type T_customMessageBtnProps = {updMessage: T_updMessage, children?: ReactNode}
type T_messagesSource = Record<string, T_appTimerStateMsg>
// import { CONTROL_ACTIONS } from './controlsCore'

export const MESSAGES = {
    TAXI:   { text: 'TAXI',                      type: ''        },
    LAST:   { text: 'L A S T',                   type: 'warning1'},
    NEXT_L: { text: 'Next Last',                 type: ''        },
    HEART:  { text: '\u2764',                    type: 'alert1'  },
    LOAD:   { text: 'Loading...',                type: ''        },
    LEGS:   { text: 'Выпрямите НОГИ!',           type: 'overlap' },
    RELAX:  { text: 'Выдохните расслабьтесь ;)', type: 'overlap' },
    BEXIT:  { text: 'Запасной выход',            type: 'overlap' },
    LIGHT:  { text: 'Выключи свет пжл',          type: 'overlap' },

    CLEAR:  { text: '', type: '' },
}

export const ALERT_MESSAGES = {
    OUT:    { text: 'ОТОЙДИТЕ ОТ ВХОДА !!!',    type: 'alert2'},
    OUT2:   { text: 'УБЕРИТЕ ... ОТ ВХОДА !!!', type: 'alert2'},
    HELMET: { text: 'ШЛЕМ !',                   type: 'alert2'},
    GOOGLES:{ text: 'ОЧКИ !',                   type: 'alert2'},
    KED:    { text: 'КЕД !',                    type: 'alert2'},
    DOWN:   { text: 'ВНИЗ !',                   type: 'alert2'},
    DOOR:   { text: 'ДВЕРЬ !',                  type: 'alert2'},
}

const getMessagesList = ({
    updMessage,
    messagesSource = MESSAGES,
    addClassName   = '',
}:{
    updMessage    : T_updMessage,
    messagesSource: T_messagesSource,
    addClassName  : string,
}) => {
    const messagesJSXArray = Object.entries(messagesSource).map(
        ([messageId, messageObj]) => (
            <div
                key={messageId}
                id ={messageId}
            >
                {messageObj.text}
            </div>
        )
    )

    const onClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!('target' in e) || !(e.target instanceof HTMLDivElement)) {
            return
        }
        const messageId  = e.target.id
        if (messagesSource.hasOwnProperty(messageId) === false) {
            return
        }
        const preMessageObj = messagesSource[messageId as keyof typeof messagesSource]
        const messageObj    = {messageId, ...preMessageObj}
        updMessage(messageObj)
    }

    return ({onClose}:{onClose: () => void}) => (
        <div className='msgModalWrapper' onClick={onClose}>
            <div
                id="messagesList"
                className ={`messagesList messagesList-${addClassName}`}
                onClick   = {onClick}
            >
                {messagesJSXArray}
            </div>
        </div>
    )
}

function MessageBtnExpandableTemplate({
    MessagesSource,
    btnId,
    addClassName,
    children = null,
}:{
    MessagesSource: ReturnType<typeof getMessagesList>,
    addClassName  : string,
    btnId         : string,
    children      : ReactNode,
}) {
    const [isExpanded, setExpanded] = useState(false)
    const onOpen  = () => setExpanded(true)
    const onClose = () => setExpanded(false)
    const className = `quickBtn message-button customMsgBtn customMsgBtn-${addClassName}`

    return (<>
        <button
            id           = {btnId}
            onClick      = {onOpen}
            className    = {className}
            data-message = {'customMsgBtn'}
        >
            {children}
        </button>
        {isExpanded && <MessagesSource onClose={onClose}/>}
    </>)
}

export function CustomMessageBtn({updMessage, children}:T_customMessageBtnProps) {
    const MessagesList = getMessagesList({updMessage, messagesSource: MESSAGES, addClassName: ""})
    return MessageBtnExpandableTemplate({
        btnId         : 'customMsgBtn',
        addClassName  : '',
        MessagesSource: MessagesList,
        children
    })
}

export function AlertMessageBtn({updMessage, children}:T_customMessageBtnProps) {
    const MessagesList = getMessagesList({updMessage, messagesSource: ALERT_MESSAGES, addClassName: 'alert'})
    return MessageBtnExpandableTemplate({
        btnId         : 'alertMsgBtn',
        addClassName  : 'alert',
        MessagesSource: MessagesList,
        children
    })
}

export function HelmetMessageBtn({updMessage, children}:T_customMessageBtnProps) {
    const MessagesSource = useMemo( () =>
        ({onClose}:{onClose: () => void}) => <Numpad updMessage={updMessage} onClose={onClose}/>,
        [updMessage]
    )
    return MessageBtnExpandableTemplate({
        btnId         : 'helmetMsgBtn',
        addClassName  : '',
        MessagesSource: MessagesSource,
        children
    })
}
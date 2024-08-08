import { MouseEvent, useEffect, useRef } from "react"

import "./styles-modal.css"



type T_ModalProps = {
    title       : string;
    isOpened    : boolean;
    onProceed   : () => void;
    onClose     : () => void;
    children    : React.ReactNode;
}



const isClickInsideRectangle = (e: MouseEvent, element: HTMLElement) => {
    const r = element.getBoundingClientRect()
    const res =  e.clientX === 0 && e.clientY === 0 || (
        e.clientX > r.left &&
        e.clientX < r.right &&
        e.clientY > r.top &&
        e.clientY < r.bottom
    )
    // console.log('CLICK ' + (res ? 'inside' : 'outside') + 'DIALOG', e)
    return res
}


export const ModalDialog = ({
    title,
    isOpened,
    onProceed,
    onClose,
    children,
}: T_ModalProps) => {
    const ref = useRef<HTMLDialogElement>(null)

    useEffect(() => {
        if (isOpened) {
            ref.current?.showModal()
            document.body.classList.add("modal-open")
        } else {
            ref.current?.close();
            document.body.classList.remove("modal-open")
        }
    }, [isOpened])

    const proceedAndClose = () => {
        onProceed()
        onClose()
    }

    return (
        <dialog className="modal-container"
            ref={ref}
            onCancel={onClose}
            onClick={(e) =>
                ref.current && !isClickInsideRectangle(e, ref.current) && onClose()
            }
        >
            <h3>{title}</h3>

            {children}

            <div className="modal-buttons">
                <button onClick={proceedAndClose}>Proceed</button>
                <button onClick={onClose}>Close</button>
            </div>
        </dialog>
    );
};

export default ModalDialog
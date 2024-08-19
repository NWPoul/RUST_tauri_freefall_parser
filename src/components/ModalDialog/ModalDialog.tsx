import { MouseEvent, useEffect, useRef }         from 'react'



export type T_ModalProps = {
    title       : string;
    isOpened    : boolean;
    onClose     : () => void;
    onProceed     ?: () => void;
    proceedBtnText?: string;
    closeBtnText  ?: string;
    children      ?: React.ReactNode;
}



const isClickInsideRectangle = (e: MouseEvent, element: HTMLElement) => {
    const r = element.getBoundingClientRect()
    const res =  e.clientX === 0 && e.clientY === 0 || (
        e.clientX > r.left &&
        e.clientX < r.right &&
        e.clientY > r.top &&
        e.clientY < r.bottom
    )
    return res
}


export const ModalDialog = ({
    title,
    isOpened,
    onClose,
    onProceed,
    proceedBtnText,
    closeBtnText,
    children,
}: T_ModalProps) => {
    const ref = useRef<HTMLDialogElement>(null)

    useEffect(() => {
        if (isOpened) {
            console.log("OPENING_MODAL: ", ref.current)
            ref.current?.showModal()
            document.body.classList.add("modal-open")
        } else {
            ref.current?.close();
            document.body.classList.remove("modal-open")
        }
    }, [isOpened])

    const proceedAndClose = () => {
        onProceed?.()
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
                { proceedBtnText
                    ? <button className="modal-btn modal-btn--proceed" onClick={proceedAndClose}>{proceedBtnText}</button>
                    : null
                }
                <button className="modal-btn modal-btn--close" onClick={onClose}>{closeBtnText ?? "Close"}</button>
            </div>
        </dialog>
    );
};

export default ModalDialog
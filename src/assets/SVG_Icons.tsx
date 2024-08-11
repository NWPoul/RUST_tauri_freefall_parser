export const IconLock = (
    <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-lock" viewBox="0 0 24 24"
        fill="none"
        strokeWidth="2"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path stroke="none" d="M0 0h24v24H0z"></path>
        <path d="M5 13a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v6a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-6z"></path>
        <path d="M11 16a1 1 0 1 0 2 0a1 1 0 0 0 -2 0"></path>
        <path d="M8 11v-4a4 4 0 1 1 8 0v4"></path>
    </svg>
)

const arrowPath = (
    <path
        fill="currentColor"
        stroke="currentColor"
        d="M201.4 137.4c12.5-12.5 32.8-12.5 45.3 0l160 160c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L224 205.3 86.6 342.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l160-160z"
    />
)
export const ArrowUp = (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 448" >
        {arrowPath}
    </svg>
)
export const ArrowDown = (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 448">
        <g transform="translate(0, 50) scale(1, -1)" transform-origin="center" >
            {arrowPath}
        </g>
    </svg>
)

export const FolderCheck = (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
        fill="none"
        stroke         = "currentColor"
        strokeWidth    = "2"
        strokeLinecap  = "round"
        strokeLinejoin = "round"
    >
        <path
            d="M11 19H5C3.89543 19 3 18.1046 3 17V7C3 5.89543 3.89543 5 5 5H9.58579C9.851 5 10.1054 5.10536 10.2929 5.29289L12 7H19C20.1046 7 21 7.89543 21 9V11"
        />
        <path
            d="M14 18L16 20L21 15"
        />
    </svg>
)


export const EyeIcon = (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            fill    ="currentColor"
            d="M11.9944 15.5C13.9274 15.5 15.4944 13.933 15.4944 12C15.4944 10.067 13.9274 8.5 11.9944 8.5C10.0614 8.5 8.49439 10.067 8.49439 12C8.49439 13.933 10.0614 15.5 11.9944 15.5ZM11.9944 13.4944C11.1691 13.4944 10.5 12.8253 10.5 12C10.5 11.1747 11.1691 10.5056 11.9944 10.5056C12.8197 10.5056 13.4888 11.1747 13.4888 12C13.4888 12.8253 12.8197 13.4944 11.9944 13.4944Z"
        />
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            fill    ="currentColor"
            d="M12 5C7.18879 5 3.9167 7.60905 2.1893 9.47978C0.857392 10.9222 0.857393 13.0778 2.1893 14.5202C3.9167 16.391 7.18879 19 12 19C16.8112 19 20.0833 16.391 21.8107 14.5202C23.1426 13.0778 23.1426 10.9222 21.8107 9.47978C20.0833 7.60905 16.8112 5 12 5ZM3.65868 10.8366C5.18832 9.18002 7.9669 7 12 7C16.0331 7 18.8117 9.18002 20.3413 10.8366C20.9657 11.5128 20.9657 12.4872 20.3413 13.1634C18.8117 14.82 16.0331 17 12 17C7.9669 17 5.18832 14.82 3.65868 13.1634C3.03426 12.4872 3.03426 11.5128 3.65868 10.8366Z"
        />
    </svg>
)
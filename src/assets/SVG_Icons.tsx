// export const IconLock = (
//     <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-lock" viewBox="0 0 24 24"
//         fill="none"
//         strokeWidth="2"
//         stroke="currentColor"
//         strokeLinecap="round"
//         strokeLinejoin="round"
//     >
//         <path stroke="none" d="M0 0h24v24H0z"></path>
//         <path d="M5 13a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v6a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-6z"></path>
//         <path d="M11 16a1 1 0 1 0 2 0a1 1 0 0 0 -2 0"></path>
//         <path d="M8 11v-4a4 4 0 1 1 8 0v4"></path>
//     </svg>
// )

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

// export const FolderCheck = (
//     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
//         fill="none"
//         stroke         = "currentColor"
//         strokeWidth    = "2"
//         strokeLinecap  = "round"
//         strokeLinejoin = "round"
//     >
//         <path
//             d="M11 19H5C3.89543 19 3 18.1046 3 17V7C3 5.89543 3.89543 5 5 5H9.58579C9.851 5 10.1054 5.10536 10.2929 5.29289L12 7H19C20.1046 7 21 7.89543 21 9V11"
//         />
//         <path
//             d="M14 18L16 20L21 15"
//         />
//     </svg>
// )


// export const EyeIcon = (
//     <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//         <path
//             fillRule="evenodd"
//             clipRule="evenodd"
//             fill    ="currentColor"
//             d="M11.9944 15.5C13.9274 15.5 15.4944 13.933 15.4944 12C15.4944 10.067 13.9274 8.5 11.9944 8.5C10.0614 8.5 8.49439 10.067 8.49439 12C8.49439 13.933 10.0614 15.5 11.9944 15.5ZM11.9944 13.4944C11.1691 13.4944 10.5 12.8253 10.5 12C10.5 11.1747 11.1691 10.5056 11.9944 10.5056C12.8197 10.5056 13.4888 11.1747 13.4888 12C13.4888 12.8253 12.8197 13.4944 11.9944 13.4944Z"
//         />
//         <path
//             fillRule="evenodd"
//             clipRule="evenodd"
//             fill    ="currentColor"
//             d="M12 5C7.18879 5 3.9167 7.60905 2.1893 9.47978C0.857392 10.9222 0.857393 13.0778 2.1893 14.5202C3.9167 16.391 7.18879 19 12 19C16.8112 19 20.0833 16.391 21.8107 14.5202C23.1426 13.0778 23.1426 10.9222 21.8107 9.47978C20.0833 7.60905 16.8112 5 12 5ZM3.65868 10.8366C5.18832 9.18002 7.9669 7 12 7C16.0331 7 18.8117 9.18002 20.3413 10.8366C20.9657 11.5128 20.9657 12.4872 20.3413 13.1634C18.8117 14.82 16.0331 17 12 17C7.9669 17 5.18832 14.82 3.65868 13.1634C3.03426 12.4872 3.03426 11.5128 3.65868 10.8366Z"
//         />
//     </svg>
// )


export const PlayBtnIcon = (
    <svg xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        viewBox="0 0 512 512"
        // enable-background="new 0 0 512 512"
    >
        <g>
            <path d="m361.5,239.2l-187.6-130.6c-9.5-7.3-30.8-4.8-32.1,16.8v261.2c1.5,23.3 24,23.3 32.1,16.8l187.6-130.6c8.1-5.3 15.7-20.9 0-33.6zm-178.9,108.3v-183l131.5,91.5-131.5,91.5z"/>
            <path d="M440.8,11H71.3C38,11,11,38,11,71.2v369.5C11,474,38,501,71.3,501h369.5c33.2,0,60.2-27,60.2-60.2V71.2    C501,38,474,11,440.8,11z M460.2,440.8c0,10.7-8.7,19.4-19.4,19.4H71.3c-10.7,0-19.4-8.7-19.4-19.4V71.2    c0-10.7,8.7-19.4,19.4-19.4h369.5c10.7,0,19.4,8.7,19.4,19.4V440.8z"/>
        </g>
    </svg>
)



export const FolderVideoIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" id="video-folder"
        viewBox="0 0 48 48"
        fill="currentColor"
    >
        <path
            d="M41,11H21.57L20.45,8.69A3,3,0,0,0,17.75,7H7a3,3,0,0,0-3,3V38a3,3,0,0,0,3,3H41a3,3,0,0,0,3-3V14A3,3,0,0,0,
            41,11Zm1,27a1,1,0,0,1-1,1H7a1,1,0,0,1-1-1V10A1,1,0,0,1,7,9H17.75a1,1,0,0,1,.9.56l2.79,5.75A3,3,0,0,0,
            24.14,17H39a1,1,0,0,0,0-2H24.14a1,1,0,0,1-.9-.56L22.54,13H41a1,1,0,0,1,1,1ZM29.85,25.74,21,20.92a2,2,0,0,0-2,0,2,2,0,0,0-1,1.72v9.64A2,2,0,0,0,
            19,34a2,2,0,0,0,1,.28,2,2,0,0,0,.95-.24l8.9-4.82a2,2,0,0,0,0-3.52ZM20,32.32V22.68l8.9,4.82Z"
        >
        </path>
    </svg>
)
export const StopWatchIcon = (
    <svg id="Layer_1" xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 512 512"
        fill="currentColor"
    >
        <g>
            <path d="M392.09,122.767l15.446-24.272c6.858-10.778,3.681-25.076-7.097-31.935c-10.777-6.86-25.076-3.681-31.935,7.099
                l-15.409,24.215c-22.708-11.316-47.642-18.798-73.962-21.58V46.265h1.448c12.775,0,23.133-10.357,23.133-23.133
                S293.356,0,280.581,0h-49.163c-12.775,0-23.133,10.357-23.133,23.133s10.357,23.133,23.133,23.133h1.45v30.029
                C123.239,87.885,37.535,180.886,37.535,293.535C37.535,413.997,135.538,512,256,512s218.465-98.003,218.465-218.465
                C474.465,224.487,442.259,162.83,392.09,122.767z M256,465.735c-94.951,0-172.2-77.249-172.2-172.2s77.249-172.2,172.2-172.2
                s172.2,77.249,172.2,172.2S350.951,465.735,256,465.735z"/>
        </g>
        <g>
            <path d="M333.172,205.084c-9.623-8.397-24.238-7.407-32.638,2.222l-61.964,71.02c-8.399,9.626-7.404,24.24,2.222,32.638
                c9.626,8.399,24.24,7.404,32.638-2.222l61.964-71.02C343.794,228.096,342.798,213.484,333.172,205.084z"/>
        </g>
    </svg>
)

export const FallIcon = (
    <svg xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 512.000000 512.000000"
        preserveAspectRatio="xMidYMid meet"
    >
        <g transform="translate(0,512) scale(0.1,-0.1)"
            fill="currentColor"
            stroke="none"
        >
            <path d="M772 4808 c-17 -17 -17 -1599 0 -1616 7 -7 21 -12 33 -12 12 0 26 5 33 12 16 16 17 1579 2 1609 -12 21 -50 25 -68 7z"/>
            <path d="M4192 4688 c-16 -16 -16 -110 0 -126 18 -18 56 -14 68 7 5 11 10 36 10 56 0 20 -5 45 -10 56 -12 21 -50 25 -68 7z"/>
            <path d="M1632 4608 c-7 -7 -12 -35 -12 -63 0 -56 12 -75 47 -75 27 0 43 27 43 75 0 20 -5 45 -10 56 -12 21 -50 25 -68 7z"/>
            <path d="M2632 4488 c-16 -16 -16 -110 0 -126 36 -36 78 1 78 67 0 51 -12 71 -45 71 -12 0 -26 -5 -33 -12z"/>
            <path d="M4192 4488 c-17 -17 -17 -2059 0 -2076 18 -18 56 -14 68 7 14 27 14 2035 0 2062 -12 21 -50 25 -68 7z"/>
            <path d="M1632 4408 c-17 -17 -17 -859 0 -876 18 -18 56 -14 68 7 14 27 14 835 0 862 -12 21 -50 25 -68 7z"/>
            <path d="M2632 4288 c-17 -17 -17 -479 0 -496 17 -17 44 -15 62 4 14 13 16 50 16 244 0 194 -2 231 -16 244 -18 19 -45 21 -62 4z"/>
            <path d="M3672 4168 c-16 -16 -16 -110 0 -126 36 -36 78 1 78 67 0 51 -12 71 -45 71 -12 0 -26 -5 -33 -12z"/>
            <path d="M3672 3968 c-17 -17 -17 -1369 0 -1386 17 -17 44 -15 62 4 14 14 16 90 16 689 0 599 -2 675 -16 689 -18 19 -45 21 -62 4z"/>
            <path d="M2642 3490 c-39 -24 -72 -75 -72 -112 0 -15 32 -140 70 -277 39 -138
            70 -257 70 -265 0 -8 -66 -77 -146 -154 l-146 -140 -351 -202 -350 -202 -264
            73 -263 72 -142 226 c-152 242 -168 265 -210 287 -83 43 -198 -28 -198 -124 0
            -43 6 -53 182 -337 154 -246 196 -300 245 -310 39 -9 646 -175 649 -178 1 -1
            108 -186 238 -412 251 -434 288 -486 386 -539 96 -52 232 -69 345 -41 33 8
            209 47 390 85 182 39 335 73 342 75 6 2 138 -133 293 -300 217 -234 290 -307
            320 -319 163 -65 324 99 252 257 -27 59 -648 726 -697 748 -44 20 -112 24
            -163 10 -18 -6 -32 -7 -30 -3 2 4 42 45 90 91 l88 84 37 -10 c21 -6 198 -56
            394 -112 196 -55 372 -101 390 -101 76 1 154 60 179 136 25 74 -11 178 -75
            220 -40 26 -923 274 -975 274 -25 0 -62 -8 -82 -18 -20 -9 -128 -102 -238
            -206 -111 -104 -205 -185 -210 -180 -13 14 -410 705 -410 714 0 4 88 93 196
            196 198 190 233 235 234 296 0 39 -166 625 -185 655 -40 60 -123 80 -183 43z"/>
            <path d="M1773 3096 c-103 -34 -176 -98 -222 -196 -22 -46 -26 -69 -26 -140 0
            -76 4 -93 33 -152 38 -77 92 -130 171 -167 47 -22 70 -26 141 -26 71 0 94 4
            141 26 79 37 133 90 171 167 29 59 33 76 33 152 0 71 -4 94 -26 141 -58 124
            -169 199 -302 205 -43 3 -89 -2 -114 -10z"/>
        </g>
    </svg>

)


export const HeadDownIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" id="headDownIcon"
        viewBox="0 0 604.000000 366.000000"
        preserveAspectRatio="xMidYMid meet"
        data-tauri-drag-region
    >
        <g transform="translate(0.000000,366.000000) scale(0.100000,-0.100000)"
            fill="currentColor"
            stroke="none"
        >
            <path d="M2205 2979 c-37 -11 -64 -46 -65 -82 0 -51 16 -67 135 -135 58 -33
            61 -39 35 -60 -21 -17 -24 -27 -22 -88 3 -151 12 -181 81 -273 29 -38 41 -65
            41 -88 0 -43 38 -123 95 -198 25 -33 67 -93 94 -133 l49 -73 23 48 c25 52 169
            203 194 203 27 0 16 18 -25 43 -54 32 -220 257 -220 298 0 11 -16 53 -35 93
            -27 58 -35 87 -35 130 0 101 -95 236 -165 236 -13 0 -38 17 -59 40 -20 22 -43
            40 -51 40 -7 0 -19 2 -27 4 -7 2 -26 0 -43 -5z"/>
            <path d="M3742 2938 c-12 -6 -32 -26 -43 -44 -14 -23 -33 -37 -61 -46 -22 -6
            -45 -20 -52 -30 -7 -12 -23 -18 -47 -18 -49 0 -95 -25 -107 -58 -6 -15 -20
            -69 -32 -121 -11 -52 -25 -100 -31 -107 -5 -6 -23 -38 -38 -71 -21 -42 -61
            -91 -145 -176 -64 -64 -116 -124 -116 -133 0 -22 55 -137 99 -206 41 -66 69
            -75 98 -32 10 14 30 40 44 57 14 18 36 54 49 81 13 27 38 74 57 105 18 30 38
            72 43 93 7 22 28 53 56 80 28 26 62 75 86 123 22 44 58 99 79 122 43 46 50 83
            24 120 -15 21 -14 23 15 38 50 26 154 95 162 108 15 24 7 66 -18 96 -20 25
            -33 31 -62 30 -21 0 -47 -5 -60 -11z"/>
            <path d="M2933 2012 c-23 -15 -60 -38 -82 -51 -99 -60 -168 -236 -127 -322 9
            -19 27 -47 41 -62 20 -21 25 -36 23 -65 -3 -34 -1 -37 22 -37 20 0 26 6 28 28
            4 29 31 50 49 39 6 -4 13 -18 14 -32 4 -24 8 -25 77 -28 46 -2 72 1 72 8 0 6
            -7 13 -15 16 -41 16 21 154 69 154 20 0 27 8 40 47 9 26 16 53 16 60 0 8 -26
            41 -57 74 -59 61 -113 147 -113 180 0 24 -6 23 -57 -9z"/>
            <path d="M3192 1717 c-12 -26 -24 -65 -27 -85 -4 -20 -14 -71 -23 -112 -22
            -95 -21 -237 1 -309 18 -58 22 -111 9 -111 -45 0 -102 154 -102 274 l0 66 -74
            0 c-43 0 -78 -5 -82 -11 -4 -6 -20 -8 -40 -4 -33 6 -34 5 -34 -30 0 -43 -26
            -221 -42 -283 -13 -52 -4 -62 55 -62 43 0 44 -3 17 -55 -15 -29 -20 -59 -20
            -116 l0 -76 45 -42 c37 -34 51 -41 86 -41 35 0 48 6 79 38 31 31 38 46 43 93
            7 56 -3 110 -23 134 -6 8 -10 26 -8 40 2 21 11 30 40 40 52 18 87 42 98 68 4
            12 31 47 60 77 28 30 59 67 68 82 9 15 22 30 30 33 31 12 156 -41 177 -75 15
            -24 105 -60 147 -58 98 2 129 9 126 26 -2 10 -16 19 -33 22 -43 7 -32 25 17
            28 112 6 128 20 89 71 -17 23 -26 25 -107 25 -70 1 -92 4 -101 17 -7 9 -32 24
            -55 34 -49 19 -119 71 -164 123 -26 29 -38 35 -72 35 -23 0 -53 -8 -66 -17
            -51 -33 -65 -12 -66 98 -1 28 -7 65 -14 81 l-13 30 -21 -48z"/>
            <path d="M2480 1569 c-47 -4 -110 -15 -140 -23 -30 -9 -73 -16 -95 -16 -31 0
            -46 -6 -68 -30 -34 -35 -43 -37 -50 -10 -4 16 -14 20 -52 20 -28 0 -52 -6 -61
            -15 -9 -8 -26 -15 -39 -15 -33 0 -55 -10 -55 -26 0 -23 43 -44 91 -44 53 0 79
            -19 54 -40 -21 -18 -2 -39 30 -32 14 2 27 8 30 12 2 4 47 5 98 2 62 -3 107 0
            133 8 21 7 66 12 99 11 54 -2 63 -5 88 -34 62 -71 119 -150 129 -178 14 -41
            30 -32 50 27 29 86 16 287 -22 340 -40 54 -59 58 -220 43z"/>
        </g>
    </svg>
)
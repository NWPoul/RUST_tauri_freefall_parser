import React     from "react";
import ReactDOM  from "react-dom/client";



import {
    useWindowLabel,
    initApiStateData,
}                            from 'API/apiHelpers'

import { ServPanel }         from './ServPanel'

initApiStateData()


ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ServPanel />
  </React.StrictMode>,
);

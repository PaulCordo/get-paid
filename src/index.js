import React from "react";
import ReactDOM from "react-dom";

import { App } from "./App";
import { PrintProvider } from "./PrintContext";
import { SessionProvider } from "./SessionContext";
import { NotificationProvider } from "./NotificationContext";
import "./index.scss";

ReactDOM.render(
  <NotificationProvider>
    <SessionProvider>
      <PrintProvider>
        <App />
      </PrintProvider>
    </SessionProvider>
  </NotificationProvider>,
  document.getElementById("root")
);

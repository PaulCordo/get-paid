import React from "react";
import ReactDOM from "react-dom";

import { Home } from "./Home";
import { PrintProvider } from "./PrintContext";
import { SessionProvider } from "./SessionContext";
import { NotificationProvider } from "./NotificationContext";
import "./index.scss";

ReactDOM.render(
  <NotificationProvider>
    <SessionProvider>
      <PrintProvider>
        <Home />
      </PrintProvider>
    </SessionProvider>
  </NotificationProvider>,
  document.getElementById("root")
);

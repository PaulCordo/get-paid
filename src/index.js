import React from "react";
import ReactDOM from "react-dom";

import { App } from "./App";
import { PrintProvider } from "./PrintContext";
import { SessionProvider } from "./SessionContext";
import { NotificationProvider } from "./NotificationContext";
import { ErrorBoundary } from "./ErrorBoundary";
import "./index.scss";

ReactDOM.render(
  <NotificationProvider>
    <ErrorBoundary>
      <SessionProvider>
        <PrintProvider>
          <App />
        </PrintProvider>
      </SessionProvider>
    </ErrorBoundary>
  </NotificationProvider>,
  document.getElementById("root")
);

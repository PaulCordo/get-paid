import React from "react";
import ReactDOM from "react-dom/client";

import { App } from "./App";
import { PrintProvider } from "./PrintContext";
import { SessionProvider } from "./SessionContext";
import { NotificationProvider } from "./NotificationContext";
import { ErrorBoundary } from "./ErrorBoundary";
import "./index.scss";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <NotificationProvider>
    <ErrorBoundary>
      <SessionProvider>
        <PrintProvider>
          <App />
        </PrintProvider>
      </SessionProvider>
    </ErrorBoundary>
  </NotificationProvider>
);

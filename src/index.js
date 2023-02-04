import React from "react";
import ReactDOM from "react-dom/client";

import { App } from "./App";
import { PrintProvider } from "./PrintContext";
import { StoreProvider } from "./StoreContext";
import { NotificationProvider } from "./NotificationContext";
import { ErrorBoundary } from "./ErrorBoundary";
import "./index.scss";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <NotificationProvider>
    <ErrorBoundary>
      <StoreProvider>
        <PrintProvider>
          <App />
        </PrintProvider>
      </StoreProvider>
    </ErrorBoundary>
  </NotificationProvider>
);

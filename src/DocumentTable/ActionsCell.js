import React from "react";

import { DocumentActionButtons } from "../DocumentActionButtons";

const actionCount = 4;
export function ActionsCell({ value: document }) {
  return (
    <div style={{ minWidth: 42 * actionCount + 16 * (actionCount - 1) + 1 }}>
      <DocumentActionButtons document={document} />
    </div>
  );
}

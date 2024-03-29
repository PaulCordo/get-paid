import React from "react";

import { DocumentActionButtons } from "../DocumentActions";

const actionCount = 5;
export function ActionsCell({ value: document }) {
  return (
    <div style={{ minWidth: 42 * actionCount + 16 * (actionCount - 1) + 1 }}>
      <DocumentActionButtons document={document} />
    </div>
  );
}

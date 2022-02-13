import React from "react";

import { DocumentActionButtons } from "../DocumentActionButtons";

export function ActionsCell({ value: document }) {
  return (
    <div style={{ minWidth: 42 * 3 + 16 * 2 + 1 }}>
      <DocumentActionButtons document={document} />
    </div>
  );
}

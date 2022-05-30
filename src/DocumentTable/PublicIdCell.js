import React from "react";
import classNames from "classnames";

export function PublicIdCell({
  value,
  row: {
    original: { canceledBy },
  },
}) {
  return (
    <div
      className={classNames("text-center", {
        "text-decoration-line-through": canceledBy,
      })}
    >
      {value}
    </div>
  );
}

import React from "react";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

export function ClientCell({
  value: client,
  row: {
    original: { number, type },
  },
}) {
  return (
    <OverlayTrigger
      placement="right"
      overlay={
        <Tooltip id={`tooltip-client-${client?.name}-${type}-${number}`}>
          <h5 className="text-uppercase mb-1">
            {client?.idType} {client?.idNumber}
          </h5>
          <address>
            {client?.addressLine1}
            <br />
            {client?.addressLine2}
            {client?.addressLine2 && <br />}
            {client?.zipCode} {client?.city}
            <br />
            <div className="mt-1">
              {client?.tel}
              {client?.tel && <br />}
              {client?.email}
            </div>
          </address>
        </Tooltip>
      }
    >
      <>{client?.name}</>
    </OverlayTrigger>
  );
}

import React from "react";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import ToggleButton from "react-bootstrap/ToggleButton";
import { FaArchive, FaSlash } from "react-icons/fa";

export function archiveFilter(rows, id, value) {
  return rows.filter(({ original: document }) =>
    value ? document.archived : !document.archived
  );
}

export function ArchiveFilter({ column: { setFilter, filterValue } }) {
  return (
    <OverlayTrigger
      placement="top"
      overlay={
        <Tooltip id="tooltip-archive-filter">
          {filterValue ? (
            "Afficher les documents non archivés"
          ) : (
            <>N&lsquo;afficher que les documents archivés</>
          )}
        </Tooltip>
      }
    >
      <ToggleButton
        id="paid-filter-archive"
        name="paid-filter-archive"
        type="checkbox"
        variant="outline-secondary"
        checked={filterValue}
        onChange={({ currentTarget: { checked } }) => setFilter(checked)}
        value={1}
      >
        <FaArchive />
        {filterValue && (
          <FaSlash className="text-secondary" style={{ marginLeft: "-1em" }} />
        )}
      </ToggleButton>
    </OverlayTrigger>
  );
}

export function DocumentTableArchiveFilter({ documentTable }) {
  return documentTable?.headerGroups
    ?.flatMap(({ headers }) => headers)
    ?.filter(({ Filter }) => Filter)
    ?.find((header) => header.id === "title" && header.Filter)
    ?.render("Filter");
}

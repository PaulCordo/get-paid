import React from "react";
import Button from "react-bootstrap/Button";
import {
  FaEye,
  FaFileDownload,
  FaCopy,
  FaEdit,
  FaTrash,
  FaMoneyCheckAlt,
} from "react-icons/fa";

import {
  getDocumentColor,
  getDocumentState,
  documentStates,
} from "./documentStates";
const { INVOICE, QUOTE, DRAFT } = documentStates;

export function DocumentRow({
  document: {
    number,
    client: { name },
    title,
    total,
    date,
    type,
    draft,
  },
  onView = () => {},
  onDownload = () => {},
  onDuplicate = () => {},
  onEdit = () => {},
  onDelete = () => {},
}) {
  const documentState = getDocumentState({ type, draft });
  return (
    <tr>
      <th
        scope="row"
        style={{
          borderLeftWidth: 7,
          borderLeftColor: getDocumentColor({ type, draft }),
        }}
      >
        #{number}
      </th>
      <td className="align-middle">{name}</td>
      <td className="align-middle">{title}</td>
      <td className="align-middle">{total}€</td>
      <td className="align-middle">{date}</td>
      <td className="text-end" style={{ minWidth: 42 * 3 + 16 * 3.5 + 1 }}>
        {documentState === DRAFT && (
          <>
            <Button
              onClick={onEdit}
              variant="secondary"
              className="me-3"
              title="Editer"
            >
              <FaEdit />
            </Button>
            <Button onClick={onDelete} variant="danger" title="Supprimer">
              <FaTrash />
            </Button>
          </>
        )}
        {documentState === INVOICE && (
          <>
            <Button
              onClick={onView}
              variant="secondary"
              className="me-3"
              title="Voir"
            >
              <FaEye />
            </Button>
            <Button
              onClick={onDownload}
              variant="success"
              className="me-3"
              title="Télécharger"
            >
              <FaFileDownload />
            </Button>
            <Button onClick={onDuplicate} variant="warning" title="Dupliquer">
              <FaCopy />
            </Button>
          </>
        )}
        {documentState == QUOTE && (
          <>
            <Button
              onClick={onView}
              variant="secondary"
              className="me-3"
              title="Voir"
            >
              <FaEye />
            </Button>
            <Button
              onClick={onDownload}
              variant="primary"
              className="me-3"
              title="Télécharger"
            >
              <FaFileDownload />
            </Button>
            <Button onClick={onDuplicate} variant="success" title="Facturer">
              <FaMoneyCheckAlt />
            </Button>
          </>
        )}
      </td>
    </tr>
  );
}

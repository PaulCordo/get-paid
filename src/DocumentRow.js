import Button from "react-bootstrap/Button";
import {
  FaEye,
  FaFileDownload,
  FaCopy,
  FaEdit,
  FaTrash,
  FaMoneyCheckAlt,
} from "react-icons/fa";

import { INVOICE, QUOTE } from "./documentTypes";
import { success, secondary, primary } from "./variables.module.scss";
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
  return (
    <tr>
      <th
        scope="row"
        style={{
          borderLeftWidth: 7,
          borderLeftColor: draft
            ? secondary
            : type === INVOICE
            ? success
            : primary,
        }}
      >
        #{number}
      </th>
      <td className="align-middle">{name}</td>
      <td className="align-middle">{title}</td>
      <td className="align-middle">{total}€</td>
      <td className="align-middle">{date}</td>
      <td className="text-right" style={{ width: 42 * 3 + 16 * 3.5 + 1 }}>
        {draft && (
          <>
            <Button
              onClick={onEdit}
              variant="secondary"
              className="mr-3"
              title="Editer"
            >
              <FaEdit />
            </Button>
            <Button onClick={onDelete} variant="danger" title="Supprimer">
              <FaTrash />
            </Button>
          </>
        )}
        {!draft && type === INVOICE && (
          <>
            <Button
              onClick={onView}
              variant="secondary"
              className="mr-3"
              title="Voir"
            >
              <FaEye />
            </Button>
            <Button
              onClick={onDownload}
              variant="success"
              className="mr-3"
              title="Télécharger"
            >
              <FaFileDownload />
            </Button>
            <Button onClick={onDuplicate} variant="warning" title="Dupliquer">
              <FaCopy />
            </Button>
          </>
        )}
        {!draft && type == QUOTE && (
          <>
            <Button
              onClick={onView}
              variant="secondary"
              className="mr-3"
              title="Voir"
            >
              <FaEye />
            </Button>
            <Button
              onClick={onDownload}
              variant="primary"
              className="mr-3"
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

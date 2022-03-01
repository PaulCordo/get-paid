import React, { useContext, useMemo } from "react";
import classnames from "classnames";
import Table from "react-bootstrap/Table";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import {
  useTable,
  useSortBy,
  useRowSelect,
  usePagination,
  useFilters,
  useGlobalFilter,
} from "react-table";

import { getDocumentColor } from "../documentStates";
import { SessionContext } from "../SessionContext";
import { ClientCell } from "./ClientCell";
import { ActionsCell } from "./ActionsCell";
import { DateCell } from "./DateCell";
import { TotalCell } from "./TotalCell";
import { dateOrderer } from "./dateOrderer";
import { GlobalFilter } from "./GlobalFilter";
import { StateFilter, stateFilter } from "./StateFilter";
import "./DocumentTable.scss";

export function DocumentTable() {
  const { documents } = useContext(SessionContext);
  const columns = useMemo(
    () => [
      {
        Header: "Identifiant",
        accessor: "publicId",
        className: "text-center",
        Filter: StateFilter,
        filter: stateFilter,
      },
      {
        Header: "Client",
        accessor: "client",
        Cell: ClientCell,
      },
      {
        Header: "Pour",
        accessor: "title",
      },
      {
        Header: "Total TTC",
        id: "total",
        accessor: "total",
        Cell: TotalCell,
      },
      {
        Header: "Date",
        accessor: "date",
        Cell: DateCell,
        sortType: dateOrderer,
      },
      {
        Header: <span className="text-end">Actions</span>,
        id: "actions",
        accessor: (document) => document,
        Cell: ActionsCell,
        className: "text-end",
        disableSortBy: true,
      },
    ],
    []
  );
  const documentTable = useTable(
    {
      columns,
      data: documents,
      initialState: {
        sortBy: [
          {
            id: "date",
            desc: true,
          },
        ],
        filters: [
          {
            id: "publicId",
            value: "default",
          },
        ],
      },
    },
    useFilters,
    useGlobalFilter,
    useSortBy,
    usePagination,
    useRowSelect
  );
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    documentTable;
  return documents && documents.length > 0 ? (
    <>
      <Row className="mb-4">
        <Col>
          {documentTable?.headerGroups
            ?.flatMap(({ headers }) => headers)
            ?.filter(({ Filter }) => Filter)
            ?.find((header) => header.id === "publicId" && header.Filter)
            ?.render("Filter")}
        </Col>
        <Col>
          <GlobalFilter
            preGlobalFilteredRows={documentTable?.preGlobalFilteredRows}
            globalFilter={documentTable?.state.globalFilter}
            setGlobalFilter={documentTable?.setGlobalFilter}
          />
        </Col>
      </Row>
      <Table
        striped
        bordered
        hover
        className="mt-3 document-table"
        {...getTableProps()}
      >
        <thead>
          {headerGroups.map((headerGroup, index) => (
            <tr {...headerGroup.getHeaderGroupProps()} key={index}>
              {headerGroup.headers.map((column, index) => (
                <th
                  scope="col"
                  {...column.getHeaderProps()}
                  {...column.getSortByToggleProps()}
                  className={classnames(
                    {
                      sort: column.canSort,
                      "sorted-up": column.isSorted && !column.isSortedDesc,
                      "sorted-down": column.isSortedDesc,
                    },
                    "align-bottom",
                    column.className
                  )}
                  key={index}
                >
                  {column.render("Header")}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()} key={row?.original?._id}>
                {row.cells.map((cell, index) => (
                  <td
                    {...cell.getCellProps()}
                    key={index}
                    className={classnames(
                      "align-middle",
                      cell.column.className
                    )}
                    style={{
                      borderLeftColor:
                        // colorize row left border by type
                        !index && getDocumentColor(cell.row.original),
                    }}
                  >
                    {cell.render("Cell")}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
        {!rows?.length && (
          <caption className="text-center">Aucun document</caption>
        )}
      </Table>
    </>
  ) : null;
}

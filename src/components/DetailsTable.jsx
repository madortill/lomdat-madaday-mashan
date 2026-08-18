import React, { useMemo, useState } from "react";

function escapeCsvValue(value) {
  const safeValue = String(value ?? "").replace(/"/g, '""');
  return `"${safeValue}"`;
}

export default function DetailsTable({
  rows = [],
  exceptionName = "דוח פרטני",
}) {
  const columns = useMemo(
    () => [
      { key: "personalNumber", label: "מספר אישי", width: 125 },
      { key: "firstName", label: "שם פרטי", width: 125 },
      { key: "lastName", label: "שם משפחה", width: 125 },
      { key: "exceptionStart", label: "ת. תחילת חריג", width: 140 },
      { key: "exceptionEnd", label: "ת. סיום חריג", width: 140 },
      { key: "eventNumber", label: "מספר מופע", width: 125 },
      { key: "unit", label: "יחידה לשיוך", width: 135 },
      { key: "daysInException", label: "מספר ימים בחריגה", width: 140 },
      { key: "gender", label: "מין", width: 100 },
      { key: "corps", label: "חיל", width: 100 },
      { key: "branch", label: "זרוע", width: 100 },
      { key: "rank", label: "דרגה", width: 110 },
    ],
    []
  );

  /*
    הנתונים מגיעים מבחוץ כ-prop ולא נשמרים ב-state,
    ולכן אין במסך שום מנגנון שמאפשר לערוך אותם.
  */

  const [search, setSearch] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "asc",
  });

  const visibleRows = useMemo(() => {
    let result = [...rows];

    const globalSearch = search.trim().toLowerCase();

    if (globalSearch) {
      result = result.filter((row) =>
        columns.some((column) =>
          String(row[column.key] ?? "")
            .toLowerCase()
            .includes(globalSearch)
        )
      );
    }

    if (sortConfig.key) {
      result.sort((a, b) => {
        const aValue = String(a[sortConfig.key] ?? "");
        const bValue = String(b[sortConfig.key] ?? "");

        const comparison = aValue.localeCompare(bValue, "he", {
          numeric: true,
        });

        return sortConfig.direction === "asc"
          ? comparison
          : -comparison;
      });
    }

    return result;
  }, [rows, columns, search, sortConfig]);

  const handleSort = (key) => {
    setSortConfig((current) => ({
      key,
      direction:
        current.key === key && current.direction === "asc"
          ? "desc"
          : "asc",
    }));
  };

  const handleExport = () => {
    const header = columns.map((column) => column.label);

    const body = visibleRows.map((row) =>
      columns.map((column) => row[column.key] ?? "")
    );

    const csv = [header, ...body]
      .map((row) =>
        row.map(escapeCsvValue).join(",")
      )
      .join("\n");

    /*
      UTF-8 BOM כדי שעברית תיפתח נכון ב-Excel.
    */
    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    const safeName = exceptionName
      .replace(/[\\/:*?"<>|]/g, "-")
      .trim();

    link.href = url;
    link.download = `${safeName || "details-report"}.csv`;

    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
  };

  return (
    <div className="details-table-component" dir="rtl">
      <div className="details-table-card">
        <div className="details-table-toolbar">
          <button
            type="button"
            className="details-table-button details-table-export"
            onClick={handleExport}
          >
            <span>ייצא לאקסל</span>
            <span aria-hidden="true">▣</span>
          </button>

          <input
            className="details-table-search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="חיפוש"
            aria-label="חיפוש בטבלה"
          />
        </div>

        <div className="details-table-scroll">
          <table className="details-table">
            <colgroup>
              {columns.map((column) => (
                <col
                  key={column.key}
                  style={{ width: `${column.width}px` }}
                />
              ))}
            </colgroup>

            <thead>
              <tr>
                {columns.map((column) => (
                  <th key={column.key}>
                    <div className="details-table-header">
                      <span>{column.label}</span>

                      <button
                        type="button"
                        onClick={() => handleSort(column.key)}
                        className="details-table-sort"
                        aria-label={`מיון לפי ${column.label}`}
                      >
                        <span>▲</span>
                        <span>▼</span>
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {visibleRows.length > 0 ? (
                visibleRows.map((row, index) => (
                  <tr key={row.id ?? index}>
                    {columns.map((column) => (
                      <td key={column.key}>
                        {row[column.key] ?? ""}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    className="details-table-empty"
                    colSpan={columns.length}
                  >
                    אין נתונים להצגה עבור החריג הזה כרגע
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
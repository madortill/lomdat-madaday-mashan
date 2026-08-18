import { useMemo } from "react";

import "../css/ReportDetailsScreen.css";

import reportDetailsSvg from "../assets/images/computer/report-details-screen.svg?raw";
import DetailsTable from "./DetailsTable";
import detailsData from "../data/exceptionDetailsData.json";

function ReportDetailsScreen({ exceptionName }) {
  const svgMarkup = useMemo(
    () => ({
      __html: reportDetailsSvg,
    }),
    []
  );

  /*
    כל הנתונים של כל חריג נמצאים בקובץ JSON.
    אם לחריג מסוים עדיין אין נתונים, נקבל מערך ריק.
  */
  const rows = useMemo(
    () => detailsData[exceptionName] ?? [],
    [exceptionName]
  );

  const nameLength = exceptionName?.length ?? 0;

  const nameClass =
    nameLength > 65
      ? "is-very-long"
      : nameLength > 45
        ? "is-long"
        : "";

  return (
    <div className="report-details-screen" dir="rtl">
      <div
        className="report-details-svg"
        dangerouslySetInnerHTML={svgMarkup}
      />

      <div
        className={`report-details-exception-name ${nameClass}`}
        title={exceptionName}
      >
        {exceptionName}
      </div>

      <div className="report-details-table-area">
        <DetailsTable
          rows={rows}
          exceptionName={exceptionName}
        />
      </div>
    </div>
  );
}

export default ReportDetailsScreen;
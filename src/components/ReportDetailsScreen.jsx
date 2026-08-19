import { useMemo, useState } from "react";
import "../css/ReportDetailsScreen.css";

import reportDetailsSvg from "../assets/images/computer/report-details-screen.svg?raw";
import DetailsTable from "./DetailsTable";
import detailsData from "../data/exceptionDetailsData.json";
import ExceptionExplanationModal from "./ExceptionExplanationModal";

function ReportDetailsScreen({
  exceptionName,
  progress,
  exceptionComplete,
  onExplanationViewed,
  onTreatmentViewed,
  onQuestionAnswered,
  onBackToExceptions,
}) {
  const [explanationOpen, setExplanationOpen] =
    useState(false);

  const svgMarkup = useMemo(
    () => ({
      __html: reportDetailsSvg,
    }),
    []
  );

  const exceptionData = useMemo(
    () =>
      detailsData[exceptionName] ?? {
        explanation: "",
        treatment: "",
        rows: [],
      },
    [exceptionName]
  );

  const rows = exceptionData.rows ?? [];

  const nameLength = exceptionName?.length ?? 0;

  const nameClass =
    nameLength > 65
      ? "is-very-long"
      : nameLength > 45
        ? "is-long"
        : "";

  return (
    <div
      className="report-details-screen"
      dir="rtl"
    >
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

      <button
        type="button"
        className="exception-explanation-button"
        onClick={() =>
          setExplanationOpen(true)
        }
      >
        הסבר
        <br />
        חריג
      </button>

      {/*
        הכפתור תמיד קיים, אבל נעול עד שסיימו את דרישות החריג.
        כרגע: הסבר + טיפול.
        כשנוסיף את השאלה, ComputerScene ידרוש גם questionAnswered.
      */}
      <button
        type="button"
        className="back-to-exceptions-button"
        disabled={!exceptionComplete}
        onClick={onBackToExceptions}
      >
        חזרה לרשימת החריגים
      </button>

      {!exceptionComplete && (
        <div className="back-to-exceptions-hint">
          יש לעבור על הסבר החריג ועל הטיפול לפני החזרה
        </div>
      )}

      {explanationOpen && (
        <ExceptionExplanationModal
          exceptionName={exceptionName}
          explanation={exceptionData.explanation}
          treatment={exceptionData.treatment}
          progress={progress}
          onExplanationViewed={onExplanationViewed}
          onTreatmentViewed={onTreatmentViewed}
          onClose={() =>
            setExplanationOpen(false)
          }
        />
      )}

      {/*
        נקודת חיבור מוכנה לשאלה הפתוחה:
        כשנוסיף אותה, היא תוכל לקרוא:
        onQuestionAnswered()
      */}
    </div>
  );
}

export default ReportDetailsScreen;
import { useMemo, useState } from "react";
import "../css/ReportDetailsScreen.css";

import reportDetailsSvg from "../assets/images/computer/report-details-screen.svg?raw";

import DetailsTable from "./DetailsTable";
import ExceptionExplanationModal from "./ExceptionExplanationModal";
import ExceptionQuestionModal from "./ExceptionQuestionModal";

import detailsData from "../data/exceptionDetailsData.json";

function ReportDetailsScreen({
  exceptionName,
  progress,
  previousAnswer,
  contentComplete,
  onExplanationViewed,
  onTreatmentViewed,
  onQuestionSubmit,
  onBackToExceptions,
}) {
  const [explanationOpen, setExplanationOpen] = useState(false);
  const [questionOpen, setQuestionOpen] = useState(false);

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

  const handleBackButtonClick = () => {
    if (!contentComplete) {
      return;
    }

    // אם כבר ענו בעבר - לא פותחים שוב את השאלה.
    if (progress?.questionAnswered) {
      onBackToExceptions?.();
      return;
    }

    // בפעם הראשונה פותחים את השאלה.
    setQuestionOpen(true);
  };

  const handleQuestionSubmit = (answer) => {
    setQuestionOpen(false);
    onQuestionSubmit?.(answer);
  };

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

      <button
        type="button"
        className="exception-explanation-button"
        onClick={() => setExplanationOpen(true)}
      >
        הסבר
        <br />
        חריג
      </button>

      <button
        type="button"
        className="back-to-exceptions-button"
        disabled={!contentComplete}
        onClick={handleBackButtonClick}
      >
        חזרה לרשימת החריגים
      </button>

      {!contentComplete && (
        <div className="back-to-exceptions-hint">
          יש לעבור על הסבר החריג ועל הטיפול לפני החזרה
        </div>
      )}

{explanationOpen && (
  <ExceptionExplanationModal
    exceptionName={exceptionName}
    explanation={exceptionData.explanation}
    treatment={exceptionData.treatment}
    flowchart={exceptionData.flowchart}
    progress={progress}
    onExplanationViewed={onExplanationViewed}
    onTreatmentViewed={onTreatmentViewed}
    onClose={() => setExplanationOpen(false)}
  />
)}

      {questionOpen && !progress?.questionAnswered && (
        <ExceptionQuestionModal
          exceptionName={exceptionName}
          initialAnswer={previousAnswer}
          onSubmit={handleQuestionSubmit}
        />
      )}
    </div>
  );
}

export default ReportDetailsScreen;
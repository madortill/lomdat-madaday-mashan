import { useEffect, useState } from "react";

import arrowOpen from "../assets/images/computer/arrow-open.svg";
import arrowClosed from "../assets/images/computer/arrow-closed.svg";

function ExceptionExplanationModal({
  exceptionName,
  explanation,
  treatment,
  progress,
  onExplanationViewed,
  onTreatmentViewed,
  onClose,
}) {
  /*
    ההסבר פתוח כברירת מחדל, כמו בעיצוב שלך.
  */
  const [openSection, setOpenSection] =
    useState("explanation");

  /*
    מאחר שההסבר פתוח מיד כשהחלון נפתח,
    הוא נחשב ככזה שהמשתמשת נחשפה אליו.
  */
  useEffect(() => {
    onExplanationViewed?.();
  }, [onExplanationViewed]);

  const handleExplanationClick = () => {
    const nextSection =
      openSection === "explanation"
        ? null
        : "explanation";

    setOpenSection(nextSection);

    if (nextSection === "explanation") {
      onExplanationViewed?.();
    }
  };

  const handleTreatmentClick = () => {
    const nextSection =
      openSection === "treatment"
        ? null
        : "treatment";

    setOpenSection(nextSection);

    if (nextSection === "treatment") {
      onTreatmentViewed?.();
    }
  };

  return (
    <div
      className="exception-modal-overlay"
      dir="rtl"
    >
      <div className="exception-modal">
        <div className="exception-modal-header">
          <button
            type="button"
            className="exception-modal-close"
            onClick={onClose}
            aria-label="סגירת החלון"
          >
            ×
          </button>

          <h2 className="exception-modal-name">
            {exceptionName}
          </h2>
        </div>

        <div className="exception-accordion">
          <button
            type="button"
            className={`exception-accordion-header ${
              openSection === "explanation"
                ? "is-open"
                : ""
            }`}
            onClick={handleExplanationClick}
          >
            <span className="exception-accordion-title">
              הסבר החריג

              {progress?.explanationViewed && (
                <span
                  className="exception-section-check"
                  aria-label="הסבר החריג נפתח"
                >
                  ✓
                </span>
              )}
            </span>

            <img
              src={
                openSection === "explanation"
                  ? arrowOpen
                  : arrowClosed
              }
              alt=""
              className="exception-accordion-arrow"
            />
          </button>

          {openSection === "explanation" && (
            <div className="exception-accordion-content">
              {explanation ||
                "כאן יופיע הסבר החריג."}
            </div>
          )}
        </div>

        <div className="exception-accordion">
          <button
            type="button"
            className={`exception-accordion-header ${
              openSection === "treatment"
                ? "is-open"
                : ""
            }`}
            onClick={handleTreatmentClick}
          >
            <span className="exception-accordion-title">
              טיפול החריג

              {progress?.treatmentViewed && (
                <span
                  className="exception-section-check"
                  aria-label="טיפול החריג נפתח"
                >
                  ✓
                </span>
              )}
            </span>

            <img
              src={
                openSection === "treatment"
                  ? arrowOpen
                  : arrowClosed
              }
              alt=""
              className="exception-accordion-arrow"
            />
          </button>

          {openSection === "treatment" && (
            <div className="exception-accordion-content">
              {treatment ||
                "כאן יופיע אופן הטיפול בחריג."}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ExceptionExplanationModal;
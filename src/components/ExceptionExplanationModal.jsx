import { useEffect, useState } from "react";

import arrowOpen from "../assets/images/computer/arrow-open.svg";
import arrowClosed from "../assets/images/computer/arrow-closed.svg";


/*
  Vite טוען אוטומטית את כל התרשימים
  שנמצאים בתיקייה הזו.
*/
const flowchartModules = import.meta.glob(
  "../assets/images/computer/flowcharts/attendance.svg",
  {
    eager: true,
    import: "default",
  }
);


function ExceptionExplanationModal({
  exceptionName,
  explanation,
  treatment,
  flowchart,
  progress,
  onExplanationViewed,
  onTreatmentViewed,
  onClose,
}) {
  const [openSection, setOpenSection] =
    useState("explanation");

  const [showFlowchart, setShowFlowchart] =
    useState(false);


  /* =========================
     מציאת התרשים המתאים
  ========================= */

  const flowchartPath = flowchart
    ? `../assets/images/computer/flowcharts/${flowchart}.svg`
    : null;

  const flowchartImage =
    flowchartPath
      ? flowchartModules[flowchartPath]
      : null;


  /* =========================
     סימון ההסבר ככזה שנצפה
  ========================= */

  useEffect(() => {
    onExplanationViewed?.();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  /* =========================
     הסבר החריג
  ========================= */

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


  /* =========================
     טיפול החריג
  ========================= */

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

      <div className="exception-modal-wrapper">

        {/* =========================
            החלון הראשי
        ========================= */}

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


          {/* =========================
              הסבר החריג
          ========================= */}

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

                {Array.isArray(explanation) ? (
                  explanation.map(
                    (item, index) => (
                      <div
                        key={index}
                        className="exception-explanation-line"
                      >
                        {item}
                      </div>
                    )
                  )
                ) : (
                  explanation ||
                  "כאן יופיע הסבר החריג."
                )}

              </div>
            )}

          </div>


          {/* =========================
              טיפול החריג
          ========================= */}

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

                {Array.isArray(treatment) ? (
                  treatment.map(
                    (item, index) => (
                      <div
                        key={index}
                        className="exception-treatment-line"
                      >
                        {item}
                      </div>
                    )
                  )
                ) : (
                  treatment ||
                  "כאן יופיע אופן הטיפול בחריג."
                )}

              </div>
            )}

          </div>


          {/* =========================
              תרשים זרימה
          ========================= */}

          {flowchartImage && (
            <button
              type="button"
              className={`show-flowchart-button ${
                showFlowchart
                  ? "is-open"
                  : ""
              }`}
              onClick={() =>
                setShowFlowchart(
                  (prev) => !prev
                )
              }
            >
              תרשים זרימה
            </button>
          )}

        </div>


        {/* =========================
            פופאפ התרשים
        ========================= */}

        {showFlowchart && flowchartImage && (
          <div className="flowchart-popover">

            <div className="flowchart-popover-header">

              <span>
                תרשים זרימה
              </span>


              <button
                type="button"
                className="flowchart-close"
                onClick={() =>
                  setShowFlowchart(false)
                }
                aria-label="סגירת תרשים הזרימה"
              >
                ×
              </button>

            </div>


            <div className="flowchart-popover-content">

              <img
                src={flowchartImage}
                alt={`תרשים זרימה - ${exceptionName}`}
                className="flowchart-image"
              />

            </div>

          </div>
        )}

      </div>

    </div>
  );
}


export default ExceptionExplanationModal;
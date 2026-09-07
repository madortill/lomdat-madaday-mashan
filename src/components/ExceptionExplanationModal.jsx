import { useEffect, useState } from "react";

import arrowOpen from "../assets/images/computer/arrow-open.svg";
import arrowClosed from "../assets/images/computer/arrow-closed.svg";

/* =========================
   תרשימי זרימה
========================= */

import threeFlowchart from "../assets/images/computer/flowChart/three.svg";
import driveFlowchart from "../assets/images/computer/flowChart/drive.svg";
import shamapFlowchart from "../assets/images/computer/flowChart/shamap.svg";
import shlilaFlowchart from "../assets/images/computer/flowChart/shlila.svg";
import complaintFlowchart from "../assets/images/computer/flowChart/complaint.svg";


const FLOWCHART_IMAGES = {
  three: threeFlowchart,
  drive: driveFlowchart,
  shamap: shamapFlowchart,
  shlila: shlilaFlowchart,
  complaint: complaintFlowchart,
};


function ExceptionExplanationModal({
  exceptionName,
  explanation,
  treatment,
  flowchart,
  progress,
  onExplanationViewed,
  onTreatmentViewed,
  onFlowchartViewed,
  onClose,
}) {
  const [openSection, setOpenSection] =
    useState("explanation");

  const [flowchartOpen, setFlowchartOpen] =
    useState(false);


  /* =========================
     סימון הסבר כנצפה
  ========================= */

  useEffect(() => {
    /*
      ההסבר פתוח כברירת מחדל,
      ולכן ברגע שהחלון נפתח
      הוא נחשב כנצפה.
    */
    onExplanationViewed?.();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  /* =========================
     תרשים הזרימה המתאים
  ========================= */

  const flowchartImage =
    flowchart
      ? FLOWCHART_IMAGES[flowchart]
      : null;


  const hasFlowchart =
    Boolean(flowchartImage);


  /* =========================
     האם מותר לסגור
  ========================= */

  const canClose =
    progress?.explanationViewed &&
    progress?.treatmentViewed &&
    (
      !hasFlowchart ||
      progress?.flowchartViewed
    );


  /* =========================
     פתיחת / סגירת הסבר
  ========================= */

  const handleExplanationClick = () => {
    const nextSection =
      openSection === "explanation"
        ? null
        : "explanation";

    setOpenSection(nextSection);

    /*
      אם עוברים מהטיפול להסבר,
      סוגרים תרשים פתוח.
    */
    setFlowchartOpen(false);

    if (nextSection === "explanation") {
      onExplanationViewed?.();
    }
  };


  /* =========================
     פתיחת / סגירת טיפול
  ========================= */

  const handleTreatmentClick = () => {
    const nextSection =
      openSection === "treatment"
        ? null
        : "treatment";

    setOpenSection(nextSection);

    if (nextSection !== "treatment") {
      setFlowchartOpen(false);
    }

    if (nextSection === "treatment") {
      onTreatmentViewed?.();
    }
  };


  /* =========================
     פתיחת תרשים זרימה
  ========================= */

  const handleFlowchartOpen = () => {
    /*
      השמירה מתבצעת ב-progress
      שנמצא בקומפוננטת האב.

      כך המידע נשמר גם אחרי
      שסוגרים וחוזרים.
    */
    onFlowchartViewed?.();

    setFlowchartOpen(true);
  };


  /* =========================
     הצגת טקסט / מערך
  ========================= */

  const renderContent = (
    content,
    fallbackText
  ) => {
    if (Array.isArray(content)) {
      return content.map(
        (item, index) => (
          <div
            key={index}
            className="exception-content-line"
          >
            {item}
          </div>
        )
      );
    }

    return content || fallbackText;
  };


  return (
    <div
      className="exception-modal-overlay"
      dir="rtl"
    >
      <div className="exception-modal">

        {/* =========================
            כותרת
        ========================= */}

        <div className="exception-modal-header">

          <button
            type="button"
            className={`exception-modal-close ${
              !canClose
                ? "is-disabled"
                : ""
            }`}
            onClick={() => {
              if (!canClose) {
                return;
              }

              onClose?.();
            }}
            disabled={!canClose}
            aria-label="סגירת החלון"
          >
            ×
          </button>


          {/* הכותרת + ההודעה מתחתיה */}

          <div className="exception-modal-header-content">

            <h2 className="exception-modal-name">
              {exceptionName}
            </h2>


            {!canClose && (
              <div className="exception-modal-close-hint">

                יש לעבור על הסבר החריג ועל הטיפול

                {hasFlowchart
                  ? " ולפתוח את תרשים הזרימה לפני הסגירה"
                  : " לפני הסגירה"}

              </div>
            )}

          </div>

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

              {renderContent(
                explanation,
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

              {/* הטיפול */}

              {renderContent(
                treatment,
                "כאן יופיע אופן הטיפול בחריג."
              )}


              {/* =========================
                  כפתור תרשים זרימה
              ========================= */}

              {hasFlowchart && (
                <button
                  type="button"
                  className="exception-flowchart-button"
                  onClick={handleFlowchartOpen}
                >
                  לתרשים הזרימה

                  {progress?.flowchartViewed && (
                    <span className="exception-flowchart-check">
                      ✓
                    </span>
                  )}
                </button>
              )}

            </div>
          )}

        </div>


        {/* =========================
            חלון תרשים הזרימה
        ========================= */}

        {flowchartOpen && flowchartImage && (
          <div
            className="exception-flowchart-overlay"
            onClick={() =>
              setFlowchartOpen(false)
            }
          >
            <div
              className="exception-flowchart-modal"
              onClick={(event) =>
                event.stopPropagation()
              }
            >

              <button
                type="button"
                className="exception-flowchart-close"
                onClick={() =>
                  setFlowchartOpen(false)
                }
                aria-label="סגירת תרשים הזרימה"
              >
                ×
              </button>


              <img
                src={flowchartImage}
                alt={`תרשים זרימה - ${exceptionName}`}
                className="exception-flowchart-image"
              />

            </div>
          </div>
        )}

      </div>
    </div>
  );
}


export default ExceptionExplanationModal;
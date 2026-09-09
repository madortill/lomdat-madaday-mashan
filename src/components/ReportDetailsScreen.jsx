import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import "../css/ReportDetailsScreen.css";

import reportDetailsSvg from "../assets/images/computer/report-details-screen.svg?raw";

import DetailsTable from "./DetailsTable";
import ExceptionExplanationModal from "./ExceptionExplanationModal";
import ExceptionQuestionModal from "./ExceptionQuestionModal";

import detailsData from "../data/exceptionDetailsData.json";


const REPORT_TUTORIAL_KEY =
  "report-details-tutorial-seen";


const TUTORIAL_STEPS = {
  TABLE: 0,
  EXCEL: 1,
  EXPLANATION: 2,
};


function ReportDetailsScreen({
  exceptionName,
  progress,
  previousAnswer,
  contentComplete,

  onExplanationViewed,
  onTreatmentViewed,
  onFlowchartViewed,

  onQuestionSubmit,
  onBackToExceptions,
}) {
  const [explanationOpen, setExplanationOpen] =
    useState(false);

  const [questionOpen, setQuestionOpen] =
    useState(false);


  /* =========================
     Tutorial
  ========================= */

  const [tutorialStep, setTutorialStep] =
    useState(() => {
      const alreadySeen =
        sessionStorage.getItem(
          REPORT_TUTORIAL_KEY
        );

      return alreadySeen === "true"
        ? null
        : TUTORIAL_STEPS.TABLE;
    });


  const [tutorialRect, setTutorialRect] =
    useState(null);


  const screenRef =
    useRef(null);


  /* =========================
     SVG
  ========================= */

  const svgMarkup = useMemo(
    () => ({
      __html: reportDetailsSvg,
    }),
    []
  );


  /* =========================
     נתוני החריגה
  ========================= */

  const exceptionData = useMemo(
    () =>
      detailsData[exceptionName] ?? {
        explanation: "",
        treatment: "",
        flowchart: null,
        rows: [],
      },
    [exceptionName]
  );


  const rows =
    exceptionData.rows ?? [];


  /* =========================
     גודל שם החריגה
  ========================= */

  const nameLength =
    exceptionName?.length ?? 0;


  const nameClass =
    nameLength > 65
      ? "is-very-long"
      : nameLength > 45
        ? "is-long"
        : "";


  /* =========================
     מציאת האזור שצריך להדגיש
  ========================= */

  useEffect(() => {
    if (tutorialStep === null) {
      setTutorialRect(null);
      return;
    }


    const screen =
      screenRef.current;

    if (!screen) {
      return;
    }


    const selectors = {
      [TUTORIAL_STEPS.TABLE]:
        ".report-details-table-area",

      [TUTORIAL_STEPS.EXCEL]:
        ".details-table-export",

      [TUTORIAL_STEPS.EXPLANATION]:
        ".exception-explanation-button",
    };


    const updateTutorialRect = () => {
      const selector =
        selectors[tutorialStep];

      const target =
        screen.querySelector(selector);

      if (!target) {
        setTutorialRect(null);
        return;
      }


      const screenRect =
        screen.getBoundingClientRect();

      const targetRect =
        target.getBoundingClientRect();


      /*
        קצת רווח מסביב לאזור המודגש
      */

      const padding =
        tutorialStep ===
        TUTORIAL_STEPS.EXCEL
          ? 7
          : 10;


      setTutorialRect({
        top:
          targetRect.top -
          screenRect.top -
          padding,

        left:
          targetRect.left -
          screenRect.left -
          padding,

        width:
          targetRect.width +
          padding * 2,

        height:
          targetRect.height +
          padding * 2,
      });
    };


    updateTutorialRect();


    const frame =
      requestAnimationFrame(
        updateTutorialRect
      );


    window.addEventListener(
      "resize",
      updateTutorialRect
    );


    const resizeObserver =
      new ResizeObserver(
        updateTutorialRect
      );

    resizeObserver.observe(
      screen
    );


    return () => {
      cancelAnimationFrame(frame);

      window.removeEventListener(
        "resize",
        updateTutorialRect
      );

      resizeObserver.disconnect();
    };
  }, [
    tutorialStep,
    exceptionName,
    rows.length,
  ]);


  /* =========================
     סיום ההדרכה
  ========================= */

  const finishTutorial = () => {
    sessionStorage.setItem(
      REPORT_TUTORIAL_KEY,
      "true"
    );

    setTutorialStep(null);
    setTutorialRect(null);
  };


  /* =========================
     טיפול בלחיצות Tutorial
  ========================= */

  const handleTutorialClickCapture = (
    event
  ) => {
    if (tutorialStep === null) {
      return;
    }


    const target =
      event.target;

    if (!(target instanceof Element)) {
      return;
    }


    /* =========================
       שלב 1 - טבלה
    ========================= */

    if (
      tutorialStep ===
      TUTORIAL_STEPS.TABLE
    ) {
      const table =
        target.closest(
          ".report-details-table-area"
        );

      if (!table) {
        return;
      }


      /*
        לא רוצים שבשלב הזה
        לחיצה פנימית בטבלה תעשה משהו.
      */

      event.preventDefault();
      event.stopPropagation();


      setTutorialStep(
        TUTORIAL_STEPS.EXCEL
      );

      return;
    }


    /* =========================
       שלב 2 - Excel
    ========================= */

    if (
      tutorialStep ===
      TUTORIAL_STEPS.EXCEL
    ) {
      const excelButton =
        target.closest(
          ".details-table-export"
        );

      if (!excelButton) {
        return;
      }


      /*
        בלחיצה הראשונה אנחנו רק
        מתקדמים בהדרכה ולא באמת
        מורידים Excel.
      */

      event.preventDefault();
      event.stopPropagation();


      setTutorialStep(
        TUTORIAL_STEPS.EXPLANATION
      );
    }
  };


  /* =========================
     לחיצה על הסבר חריג
  ========================= */

  const handleExplanationButtonClick =
    () => {
      /*
        זה השלב האחרון בהדרכה.

        הלחיצה גם מסיימת אותה
        וגם באמת פותחת את ההסבר.
      */

      if (
        tutorialStep ===
        TUTORIAL_STEPS.EXPLANATION
      ) {
        finishTutorial();
      }


      setExplanationOpen(true);
    };


  /* =========================
     טקסט ההדרכה
  ========================= */

  const tutorialText =
    useMemo(() => {
      if (
        tutorialStep ===
        TUTORIAL_STEPS.TABLE
      ) {
        return {
          title: "הדוח הפרטני",

          text:
            "כאן תוכלו לראות את פרטי החיילים והנתונים הרלוונטיים לחריגה. לחצו על הטבלה כדי להמשיך.",
        };
      }


      if (
        tutorialStep ===
        TUTORIAL_STEPS.EXCEL
      ) {
        return {
          title: "ייצוא לאקסל",

          text:
            "מכאן ניתן לייצא את נתוני הדוח לקובץ Excel. לחצו על כפתור האקסל כדי להמשיך.",
        };
      }


      if (
        tutorialStep ===
        TUTORIAL_STEPS.EXPLANATION
      ) {
        return {
          title: "הסבר החריג",

          text:
            "כאן תוכלו לקרוא מה משמעות החריגה ואיך מטפלים בה. לחצו על הכפתור כדי לפתוח את ההסבר.",
        };
      }


      return null;
    }, [tutorialStep]);


  /* =========================
     מיקום בועת ההדרכה
  ========================= */

  const tutorialBubbleStyle =
    useMemo(() => {
      if (!tutorialRect) {
        return {};
      }


      /*
        בטבלה - מעל הטבלה
      */

      if (
        tutorialStep ===
        TUTORIAL_STEPS.TABLE
      ) {
        return {
          left: "50%",

          top:
            tutorialRect.top -
            12,

          transform:
            "translate(-50%, -100%)",
        };
      }


      /*
        באקסל - מתחת לכפתור
      */

      if (
        tutorialStep ===
        TUTORIAL_STEPS.EXCEL
      ) {
        return {
          left:
            tutorialRect.left +
            tutorialRect.width / 2,

          top:
            tutorialRect.top +
            tutorialRect.height +
            12,

          transform:
            "translateX(-50%)",
        };
      }


      /*
        בכפתור הסבר - מעליו
      */

      return {
        left:
          tutorialRect.left +
          tutorialRect.width / 2,

        top:
          tutorialRect.top -
          12,

        transform:
          "translate(-50%, -100%)",
      };
    }, [
      tutorialRect,
      tutorialStep,
    ]);


  /* =========================
     חזרה לרשימת החריגים
  ========================= */

  const handleBackButtonClick = () => {
    if (!contentComplete) {
      return;
    }


    if (
      progress?.questionAnswered
    ) {
      onBackToExceptions?.();

      return;
    }


    setQuestionOpen(true);
  };


  /* =========================
     שליחת תשובה
  ========================= */

  const handleQuestionSubmit = (
    answer
  ) => {
    setQuestionOpen(false);

    onQuestionSubmit?.(
      answer
    );
  };


  return (
    <div
      ref={screenRef}
      className="report-details-screen"
      dir="rtl"
      onClickCapture={
        handleTutorialClickCapture
      }
    >

      {/* =========================
          רקע
      ========================= */}

      <div
        className="report-details-svg"
        dangerouslySetInnerHTML={
          svgMarkup
        }
      />


      {/* =========================
          שם החריגה
      ========================= */}

      <div
        className={`report-details-exception-name ${nameClass}`}
        title={exceptionName}
      >
        {exceptionName}
      </div>


      {/* =========================
          טבלה
      ========================= */}

      <div className="report-details-table-area">

        <DetailsTable
          rows={rows}
          exceptionName={
            exceptionName
          }
        />

      </div>


      {/* =========================
          הסבר חריג
      ========================= */}

      <button
        type="button"
        className="exception-explanation-button"
        onClick={
          handleExplanationButtonClick
        }
      >
        הסבר
        <br />
        חריג
      </button>


      {/* =========================
          חזרה לרשימת החריגים
      ========================= */}

      <button
        type="button"
        className="back-to-exceptions-button"
        disabled={!contentComplete}
        onClick={
          handleBackButtonClick
        }
      >
        חזרה לרשימת החריגים
      </button>


      {!contentComplete && (
        <div className="back-to-exceptions-hint">
          יש לעבור על הסבר החריג ועל הטיפול לפני החזרה
        </div>
      )}


      {/* =========================
          Tutorial
      ========================= */}

      {tutorialStep !== null &&
        tutorialRect && (
          <>

            <div
              className="report-tutorial-overlay"
              aria-hidden="true"
            >

              {/* שחור מעל */}

              <div
                className="report-tutorial-mask"
                style={{
                  left: 0,
                  top: 0,
                  width: "100%",
                  height:
                    tutorialRect.top,
                }}
              />


              {/* שחור מתחת */}

              <div
                className="report-tutorial-mask"
                style={{
                  left: 0,

                  top:
                    tutorialRect.top +
                    tutorialRect.height,

                  right: 0,
                  bottom: 0,
                }}
              />


              {/* שחור משמאל */}

              <div
                className="report-tutorial-mask"
                style={{
                  left: 0,

                  top:
                    tutorialRect.top,

                  width:
                    tutorialRect.left,

                  height:
                    tutorialRect.height,
                }}
              />


              {/* שחור מימין */}

              <div
                className="report-tutorial-mask"
                style={{
                  left:
                    tutorialRect.left +
                    tutorialRect.width,

                  right: 0,

                  top:
                    tutorialRect.top,

                  height:
                    tutorialRect.height,
                }}
              />

            </div>


            {/* המסגרת מסביב לאזור */}

            <div
              className="report-tutorial-highlight"
              style={{
                left:
                  tutorialRect.left,

                top:
                  tutorialRect.top,

                width:
                  tutorialRect.width,

                height:
                  tutorialRect.height,
              }}
              aria-hidden="true"
            />


            {/* בועת ההסבר */}

            {tutorialText && (
              <div
                className="report-tutorial-bubble"
                style={
                  tutorialBubbleStyle
                }
              >
                <strong className="report-tutorial-title">
                  {
                    tutorialText.title
                  }
                </strong>

                <div className="report-tutorial-text">
                  {
                    tutorialText.text
                  }
                </div>

                <div className="report-tutorial-click-hint">
                  לחצו על האזור המודגש
                </div>
              </div>
            )}

          </>
        )}


      {/* =========================
          חלון הסבר חריג
      ========================= */}

      {explanationOpen && (
        <ExceptionExplanationModal

          exceptionName={
            exceptionName
          }

          explanation={
            exceptionData.explanation
          }

          treatment={
            exceptionData.treatment
          }

          flowchart={
            exceptionData.flowchart
          }

          progress={
            progress
          }

          onExplanationViewed={
            onExplanationViewed
          }

          onTreatmentViewed={
            onTreatmentViewed
          }

          onFlowchartViewed={
            onFlowchartViewed
          }

          onClose={() =>
            setExplanationOpen(false)
          }

        />
      )}


      {/* =========================
          שאלת החריגה
      ========================= */}

      {questionOpen &&
        !progress?.questionAnswered && (

          <ExceptionQuestionModal

            exceptionName={
              exceptionName
            }

            initialAnswer={
              previousAnswer
            }

            onSubmit={
              handleQuestionSubmit
            }

          />

        )}

    </div>
  );
}


export default ReportDetailsScreen;
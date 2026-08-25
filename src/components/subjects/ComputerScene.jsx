import React, { useEffect, useMemo, useState } from "react";
import "../../css/ComputerScene.css";

import InteractiveSystemScreen from "../../components/InteractiveSystemScreen";
import ReportDetailsScreen from "../../components/ReportDetailsScreen";
import detailsData from "../../data/exceptionDetailsData.json";

import computerBg from "../../assets/images/backgrounds/computer.svg";
import gearsAnimated from "../../assets/images/computer/gearsAnimated.svg";
import logoMashan from "../../assets/images/computer/logo-mashan.png";
import Character from "../../assets/images/computer/Character.svg";
import pens from "../../assets/images/pens/Desktop - 32.svg"

const TOTAL_EXCEPTIONS = Object.keys(detailsData).length;

const REQUIRED_SYSTEM_STEPS = [
  "circles",
  "graph",
  "report",
];

/* =====================================================
   DEBUG MODE main

   בזמן פיתוח:
   true

   לפני הפצה:
   false

   זה הדבר היחיד שצריך לשנות.
===================================================== */

const DEBUG_MODE = true;

/* ===================================================== */

const DEBUG_EXCEPTION = Object.keys(detailsData)[0];

const createDebugProgress = () => {
  if (!DEBUG_MODE || !DEBUG_EXCEPTION) {
    return {};
  }

  return {
    [DEBUG_EXCEPTION]: {
      explanationViewed: true,
      treatmentViewed: true,
      questionAnswered: false,
    },
  };
};

function ComputerScene({ onClose, onComplete }) {
  /*
    בדיבאג:
    נכנסים ישר לעמוד המערכת.

    ברגיל:
    מתחילים מעמוד 0.
  */
  const [page, setPage] = useState(
    DEBUG_MODE ? 2 : 0
  );

  /*
    בדיבאג:
    שלושת העיגולים כבר נחשבים ככאלה שעברו עליהם.
  */
  const [visitedCircles, setVisitedCircles] = useState(
    DEBUG_MODE ? [1, 2, 3] : []
  );

  /*
    בדיבאג:
    הטבלה כבר זמינה.
  */
  const [tableOpen, setTableOpen] = useState(
    DEBUG_MODE
  );

  /*
    בדיבאג:
    פותחים ישר את החריג הראשון מה-JSON.
  */
  const [selectedException, setSelectedException] =
    useState(
      DEBUG_MODE
        ? DEBUG_EXCEPTION
        : null
    );

  /*
    כאן נשמרים החריגים שהושלמו באמת.
    ה-✓ בטבלת החריגים מסתמך על הרשימה הזאת.
  */
  const [completedExceptions, setCompletedExceptions] =
    useState([]);

  /*
    שומר התקדמות נפרדת לכל חריג:
    - הסבר
    - טיפול
    - שאלה

    בדיבאג:
    הסבר + טיפול כבר בוצעו,
    אבל השאלה עדיין לא נענתה.

    לכן אפשר ללחוץ ישר על
    "חזרה לרשימת החריגים"
    ולקבל את השאלה.
  */
  const [exceptionProgress, setExceptionProgress] =
    useState(() => createDebugProgress());

  /*
    כאן נשמרת התשובה לשאלה של כל חריג.
  */
  const [exceptionAnswers, setExceptionAnswers] =
    useState({});

  const [systemPhase, setSystemPhase] = useState(
    DEBUG_MODE
      ? "report"
      : "circles"
  );

  /*
    בדיבאג:
    מדלגים על העיגולים ועל הגרף.

    שלב report עדיין לא מסומן כגמור,
    כי הוא אמור להסתיים רק אחרי כל החריגים.
  */
  const [
    completedSystemSteps,
    setCompletedSystemSteps,
  ] = useState(
    DEBUG_MODE
      ? ["circles", "graph"]
      : []
  );

  const LAST_PAGE = 2;

  const systemComplete =
    REQUIRED_SYSTEM_STEPS.every((step) =>
      completedSystemSteps.includes(step)
    );

  /*
    ההתקדמות של החריג שפתוח כרגע.
  */
  const selectedExceptionProgress = useMemo(() => {
    if (!selectedException) {
      return {
        explanationViewed: false,
        treatmentViewed: false,
        questionAnswered: false,
      };
    }

    return (
      exceptionProgress[selectedException] ?? {
        explanationViewed: false,
        treatmentViewed: false,
        questionAnswered: false,
      }
    );
  }, [
    selectedException,
    exceptionProgress,
  ]);

  /*
    אפשר ללחוץ על "חזרה לרשימת החריגים"
    רק אחרי שפתחו:
    1. הסבר
    2. טיפול

    בפעם הראשונה הלחיצה תפתח את השאלה.

    אם כבר הגישו תשובה בעבר,
    היא תחזיר ישר לטבלת החריגים.
  */
  const selectedExceptionContentComplete =
    selectedExceptionProgress.explanationViewed &&
    selectedExceptionProgress.treatmentViewed;

  const characterTexts = {
    1: {
      regular:
        "בחלק הבא תלמדו ממש על המערכת עצמה!",
      bold:
        "לחצו על כפתור הבא",
    },

    2: {
      circles: {
        regular:
          "ככה נראית תמונת מצב עדכנית ביחידה במערכת מדדי משא״ן.",
        bold:
          "עברו עם העכבר מעל שלושת העיגולים",
      },

      graph: {
        regular:
          "מעולה! עברתם על שלושת הנתונים המרכזיים שמופיעים במסך.",
        bold:
          "לחצו על הגרף המהבהב",
      },

      table: {
        regular:
          "פלט החריגים כולל פירוט רחב אודות החריגים שעלו במערכת.",
        bold:
          "גללו בטבלה ולחצו על דו״ח פרטני",
      },

      complete: {
        regular:
          "מעולה! סיימתם את כל הפעולות בחלק הזה.",
        bold:
          "כעת ניתן ללחוץ על כפתור הבא",
      },
    },

    3: {
      regular:
        "כאן יהיה ההסבר הרגיל של העמוד השלישי.",
      bold:
        "לחצו על הבא לסיום החלק.",
    },
  };

  /*
    טקסט הדמות בתוך דו"ח פרטני.
  */
  const reportCharacterText = useMemo(() => {
    if (
      !selectedExceptionProgress.explanationViewed
    ) {
      return {
        regular:
          "לכל חריג מצורפים הסבר ואופן הטיפול בו.",
        bold:
          "לחצו על הסבר חריג וקראו את הסבר החריג",
      };
    }

    if (
      !selectedExceptionProgress.treatmentViewed
    ) {
      return {
        regular:
          "מעולה, עברתם על הסבר החריג.",
        bold:
          "כעת פתחו וקראו גם את טיפול החריג",
      };
    }

    if (
      !selectedExceptionProgress.questionAnswered
    ) {
      return {
        regular:
          "מעולה, עברתם על ההסבר ועל אופן הטיפול.",
        bold:
          "לחצו על חזרה לרשימת החריגים וענו על השאלה",
      };
    }

    return {
      regular:
        "מעולה, כבר סיימתם את החריג הזה.",
      bold:
        "אפשר לחזור לרשימת החריגים",
    };
  }, [selectedExceptionProgress]);

  const currentCharacterText =
    page === 2
      ? selectedException
        ? reportCharacterText
        : characterTexts[2]?.[systemPhase]
      : characterTexts[page];

  const completeSystemStep = (step) => {
    setCompletedSystemSteps((prev) => {
      if (prev.includes(step)) {
        return prev;
      }

      return [
        ...prev,
        step,
      ];
    });
  };

  /*
    עדכון התקדמות של החריג שפתוח כרגע.
  */
  const updateSelectedExceptionProgress = (
    updates
  ) => {
    if (!selectedException) {
      return;
    }

    setExceptionProgress((prev) => ({
      ...prev,

      [selectedException]: {
        explanationViewed:
          prev[selectedException]
            ?.explanationViewed ?? false,

        treatmentViewed:
          prev[selectedException]
            ?.treatmentViewed ?? false,

        questionAnswered:
          prev[selectedException]
            ?.questionAnswered ?? false,

        ...updates,
      },
    }));
  };

  const handleExplanationViewed = () => {
    updateSelectedExceptionProgress({
      explanationViewed: true,
    });
  };

  const handleTreatmentViewed = () => {
    updateSelectedExceptionProgress({
      treatmentViewed: true,
    });
  };

  /*
    מופעל רק אחרי לחיצה על "הגש"
    בשאלה הפתוחה.
  */
  const handleQuestionSubmit = (answer) => {
    if (!selectedException) {
      return;
    }

    const exceptionName =
      selectedException;

    /*
      שומרים את התשובה.
    */
    setExceptionAnswers((prev) => ({
      ...prev,
      [exceptionName]: answer,
    }));

    /*
      מסמנים שהשאלה כבר נענתה.
      לכן אם יחזרו לחריג הזה,
      לא יצטרכו לענות עליה שוב.
    */
    setExceptionProgress((prev) => ({
      ...prev,

      [exceptionName]: {
        explanationViewed:
          prev[exceptionName]
            ?.explanationViewed ?? true,

        treatmentViewed:
          prev[exceptionName]
            ?.treatmentViewed ?? true,

        questionAnswered: true,
      },
    }));

    /*
      רק עכשיו החריג מקבל ✓.
    */
    setCompletedExceptions((prev) => {
      if (prev.includes(exceptionName)) {
        return prev;
      }

      return [
        ...prev,
        exceptionName,
      ];
    });

    /*
      אחרי ההגשה חוזרים אוטומטית
      לטבלת החריגים.
    */
    setSelectedException(null);
    setSystemPhase("table");
  };

  /*
    אם כבר הגישו שאלה בעבר:
    אין שאלה נוספת.
    פשוט חוזרים לטבלה.
  */
  const handleBackToExceptions = () => {
    if (!selectedException) {
      return;
    }

    if (
      !selectedExceptionProgress.questionAnswered
    ) {
      return;
    }

    setSelectedException(null);

    if (systemComplete) {
      setSystemPhase("complete");
    } else {
      setSystemPhase("table");
    }
  };

  /*
    השלמת העיגולים.
  */
  useEffect(() => {
    if (visitedCircles.length !== 3) {
      return;
    }

    completeSystemStep("circles");

    if (
      !tableOpen &&
      !completedSystemSteps.includes("graph")
    ) {
      setSystemPhase("graph");
    }
  }, [
    visitedCircles,
    tableOpen,
    completedSystemSteps,
  ]);

  /*
    כל המערכת הסתיימה.
  */
  useEffect(() => {
    if (!systemComplete) {
      return;
    }

    setSystemPhase("complete");
  }, [systemComplete]);

  /*
    שלב הדוחות נחשב גמור
    רק אחרי שכל החריגים קיבלו ✓.
  */
  useEffect(() => {
    if (
      completedExceptions.length <
      TOTAL_EXCEPTIONS
    ) {
      return;
    }

    completeSystemStep("report");
  }, [completedExceptions]);

  /*
    בדיבאג:
    כפתור הבא פתוח כדי שתוכלי לערוך
    בלי להיתקע.

    במצב רגיל:
    הוא נעול עד השלמת כל המערכת.
  */
  const nextDisabled =
    DEBUG_MODE
      ? false
      : page === 2 &&
        !systemComplete;

  const nextPage = () => {
    if (nextDisabled) {
      return;
    }

    if (page === LAST_PAGE) {
      onComplete?.();
      return;
    }

    setPage((prev) => prev + 1);
  };

  const previousPage = () => {
    if (page === 0) {
      onClose?.();
      return;
    }

    setPage((prev) => prev - 1);
  };

  return (
    <div className="computer-scene">
      <div className="computer-stage">

        <img
          src={computerBg}
          alt=""
          className="computer-background"
        />

        <div className="computer-screen">

          {/* =====================
              PAGE 0
          ====================== */}

          {page === 0 && (
            <div className="computer-page intro-page">

              <p className="title-computer">
                קצת על המערכת
              </p>

              <p className="text-computer">
                חריג רשומת נוצר עקב אי -התאמה,
                תקלה או עבירה על חוקי הרשומת אשר
                דווחה למערכת הממוכנת. "מערכת מדדי
                משא"ן" מתעדת את חריגי הרשומת
                ומתעדכנת מידי יום. אחת לחודש יינתן
                ציון לכל יחידה/פיקוד על סמך החריגים
                בתקופה הנבחרת.
              </p>

              <p className="sec-title-computer">
                הנושאים העיקריים בהם מתמקדים חריגי
                רושמת הם:
              </p>

              <div className="gears">
                <img
                  src={gearsAnimated}
                  alt="gearsAnimated"
                  className="gears-animated"
                />
              </div>

              <div className="text-computer">
                <ul>
                  <li>
                    ניתן לצפות בחריגי הרשומת הקיימים
                    בכל עת דרך מערכת מדדי משא”ן
                  </li>

                  <li>
                    עבור כל חריג יופיע הסבר למהות
                    החריג ובאופן הטיפול
                  </li>
                </ul>
              </div>

            </div>
          )}

          {/* =====================
              PAGE 1
          ====================== */}

          {page === 1 && (
            <div className="computer-page">
              {/* <img src={pens} alt="pens" /> */}
              <img
                src={logoMashan}
                alt="logoMashan"
                className="logoMashan"
              />

            </div>
          )}

          {/* =====================
              PAGE 2
          ====================== */}

          {page === 2 && (
            <div className="computer-page">

              {selectedException ? (

                <ReportDetailsScreen
                  exceptionName={
                    selectedException
                  }

                  progress={
                    selectedExceptionProgress
                  }

                  previousAnswer={
                    exceptionAnswers[
                      selectedException
                    ] ?? ""
                  }

                  contentComplete={
                    selectedExceptionContentComplete
                  }

                  onExplanationViewed={
                    handleExplanationViewed
                  }

                  onTreatmentViewed={
                    handleTreatmentViewed
                  }

                  onQuestionSubmit={
                    handleQuestionSubmit
                  }

                  onBackToExceptions={
                    handleBackToExceptions
                  }
                />

              ) : (

                <InteractiveSystemScreen
                  visitedCircles={
                    visitedCircles
                  }

                  setVisitedCircles={
                    setVisitedCircles
                  }

                  tableOpen={
                    tableOpen
                  }

                  setTableOpen={
                    setTableOpen
                  }

                  completedExceptions={
                    completedExceptions
                  }

                  onGraphOpen={() => {
                    completeSystemStep(
                      "graph"
                    );

                    setSystemPhase(
                      "table"
                    );
                  }}

                  onReportClick={(
                    row,
                    index
                  ) => {
                    console.log(
                      "נלחץ דוח",
                      row,
                      index
                    );

                    /*
                      רק פותחים את החריג.
                      לא מסמנים אותו כגמור כאן.
                    */
                    setSelectedException(
                      row
                    );

                    setSystemPhase(
                      "report"
                    );
                  }}
                />

              )}

            </div>
          )}

        </div>

        {/* =====================
            NEXT
        ====================== */}

        <button
          className="computer-next-btn"
          onClick={nextPage}
          disabled={nextDisabled}
        >
          הבא
        </button>

        {/* =====================
            BACK

            בזמן דו"ח פרטני
            הכפתור הראשי נעלם.
        ====================== */}

        {!(
          page === 2 &&
          selectedException
        ) && (
          <button
            className="computer-back-btn"
            onClick={previousPage}
          >
            חזור
          </button>
        )}

        {/* =====================
            CHARACTER
        ====================== */}

        {page >= 1 &&
          currentCharacterText && (
            <div className="computer-character">

              <img
                src={Character}
                alt=""
                className="computer-character-image"
              />

              <div className="computer-character-text">

                <p className="character-regular">
                  {
                    currentCharacterText.regular
                  }
                </p>

                <p className="character-bold">
                  {
                    currentCharacterText.bold
                  }
                </p>

              </div>

            </div>
          )}

      </div>
    </div>
  );
}

export default ComputerScene;
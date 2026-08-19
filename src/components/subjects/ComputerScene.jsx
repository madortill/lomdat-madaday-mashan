import React, { useEffect, useMemo, useState } from "react";
import "../../css/ComputerScene.css";

import InteractiveSystemScreen from "../../components/InteractiveSystemScreen";
import ReportDetailsScreen from "../../components/ReportDetailsScreen";
import detailsData from "../../data/exceptionDetailsData.json";

import computerBg from "../../assets/images/backgrounds/computer.svg";
import gearsAnimated from "../../assets/images/computer/gearsAnimated.svg";
import logoMashan from "../../assets/images/computer/logo-mashan.png";
import Character from "../../assets/images/computer/Character.svg";

const TOTAL_EXCEPTIONS = Object.keys(detailsData).length;

const REQUIRED_SYSTEM_STEPS = [
  "circles",
  "graph",
  "report",
];

/*
  כרגע אין עדיין שאלה פתוחה, לכן false.
  כשנוסיף את השאלה יחד - נשנה ל-true ונחבר את onQuestionAnswered.
*/
const REQUIRE_OPEN_QUESTION = false;

function ComputerScene({ onClose, onComplete }) {
  const [page, setPage] = useState(0);

  // נשמר כאן כדי שלא יתאפס כשחוזרים אחורה/קדימה.
  const [visitedCircles, setVisitedCircles] = useState([]);
  const [tableOpen, setTableOpen] = useState(false);

  const [selectedException, setSelectedException] = useState(null);

  /*
    חריגים שהושלמו באמת.
    ה-✓ בטבלת החריגים מסתמך על הרשימה הזאת.
  */
  const [completedExceptions, setCompletedExceptions] = useState([]);

  /*
    התקדמות פנימית לכל חריג.
    נשמרת גם אם פותחים את אותו חריג שוב.
  */
  const [exceptionProgress, setExceptionProgress] = useState({});

  const [systemPhase, setSystemPhase] = useState("circles");
  const [completedSystemSteps, setCompletedSystemSteps] = useState([]);

  const LAST_PAGE = 3;

  const systemComplete = REQUIRED_SYSTEM_STEPS.every((step) =>
    completedSystemSteps.includes(step)
  );

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
  }, [selectedException, exceptionProgress]);

  const selectedExceptionComplete =
    selectedExceptionProgress.explanationViewed &&
    selectedExceptionProgress.treatmentViewed &&
    (!REQUIRE_OPEN_QUESTION ||
      selectedExceptionProgress.questionAnswered);

  const characterTexts = {
    1: {
      regular: "בחלק הבא תלמדו ממש על המערכת עצמה!",
      bold: "לחצו על כפתור הבא",
    },

    2: {
      circles: {
        regular:
          "ככה נראית תמונת מצב עדכנית ביחידה במערכת מדדי משא״ן.",
        bold: "עברו עם העכבר מעל שלושת העיגולים",
      },

      graph: {
        regular:
          "מעולה! עברתם על שלושת הנתונים המרכזיים שמופיעים במסך.",
        bold: "לחצו על הגרף המהבהב",
      },

      table: {
        regular:
          "פלט החריגים כולל פירוט רחב אודות החריגים שעלו במערכת.",
        bold: "גללו בטבלה ולחצו על דו״ח פרטני",
      },

      complete: {
        regular:
          "מעולה! סיימתם את כל הפעולות בחלק הזה.",
        bold: "כעת ניתן ללחוץ על כפתור הבא",
      },
    },

    3: {
      regular: "כאן יהיה ההסבר הרגיל של העמוד השלישי.",
      bold: "לחצו על הבא לסיום החלק.",
    },
  };

  /*
    טקסט דינמי לדמות בזמן שנמצאים בדו"ח.
    אין ספירה - רק הנחיה לפי מה שכבר נפתח.
  */
  const reportCharacterText = useMemo(() => {
    if (!selectedExceptionProgress.explanationViewed) {
      return {
        regular:
          "לכל חריג מצורפים הסבר ואופן הטיפול בו.",
        bold: "לחצו על הסבר חריג וקראו את הסבר החריג",
      };
    }

    if (!selectedExceptionProgress.treatmentViewed) {
      return {
        regular:
          "מעולה, עברתם על הסבר החריג.",
        bold: "כעת פתחו וקראו גם את טיפול החריג",
      };
    }

    if (
      REQUIRE_OPEN_QUESTION &&
      !selectedExceptionProgress.questionAnswered
    ) {
      return {
        regular:
          "מעולה, עברתם על ההסבר ועל אופן הטיפול.",
        bold: "ענו על שאלת הסיכום כדי לסיים את החריג",
      };
    }

    return {
      regular:
        "מעולה, סיימתם את הפעולות הנדרשות עבור החריג הזה.",
      bold: "לחצו על חזרה לרשימת החריגים",
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

      return [...prev, step];
    });
  };

  const updateSelectedExceptionProgress = (updates) => {
    if (!selectedException) {
      return;
    }

    setExceptionProgress((prev) => ({
      ...prev,
      [selectedException]: {
        explanationViewed:
          prev[selectedException]?.explanationViewed ?? false,
        treatmentViewed:
          prev[selectedException]?.treatmentViewed ?? false,
        questionAnswered:
          prev[selectedException]?.questionAnswered ?? false,
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
    מוכן לשלב הבא:
    כשנוסיף את השאלה הפתוחה, נקרא לפונקציה הזאת אחרי שליחה.
  */
  const handleQuestionAnswered = () => {
    updateSelectedExceptionProgress({
      questionAnswered: true,
    });
  };

  const handleBackToExceptions = () => {
    if (!selectedException || !selectedExceptionComplete) {
      return;
    }

    /*
      רק כאן החריג מסומן כ"הושלם",
      ולכן רק עכשיו יופיע ✓ בטבלת החריגים.
    */
    setCompletedExceptions((prev) => {
      if (prev.includes(selectedException)) {
        return prev;
      }

      return [...prev, selectedException];
    });

    setSelectedException(null);

    if (systemComplete) {
      setSystemPhase("complete");
    } else {
      setSystemPhase("table");
    }
  };

  useEffect(() => {
    if (visitedCircles.length !== 3) {
      return;
    }

    completeSystemStep("circles");

    if (!tableOpen && !completedSystemSteps.includes("graph")) {
      setSystemPhase("graph");
    }
  }, [visitedCircles, tableOpen, completedSystemSteps]);

  useEffect(() => {
    if (!systemComplete) {
      return;
    }

    setSystemPhase("complete");
  }, [systemComplete]);

  /*
    שלב report נחשב גמור רק כאשר כל החריגים קיבלו ✓.
  */
  useEffect(() => {
    if (completedExceptions.length < TOTAL_EXCEPTIONS) {
      return;
    }

    completeSystemStep("report");
  }, [completedExceptions]);

  const nextDisabled = page === 2 && !systemComplete;

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
    /*
      אין כאן יותר טיפול מיוחד בדו"ח פרטני.
      בזמן דו"ח פרטני הכפתור הראשי "חזור" בכלל לא מוצג.
    */
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
          {page === 0 && (
            <div className="computer-page intro-page">
              <p className="title-computer">
                קצת על המערכת
              </p>

              <p className="text-computer">
                חריג רשומת נוצר עקב אי -התאמה, תקלה או עבירה על חוקי הרשומת אשר
                דווחה למערכת הממוכנת. "מערכת מדדי משא"ן" מתעדת את חריגי הרשומת
                ומתעדכנת מידי יום. אחת לחודש יינתן ציון לכל יחידה/פיקוד על סמך
                החריגים בתקופה הנבחרת.
              </p>

              <p className="sec-title-computer">
                הנושאים העיקריים בהם מתמקדים חריגי רושמת הם:
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
                    ניתן לצפות בחריגי הרשומת הקיימים בכל עת דרך מערכת מדדי משא”ן
                  </li>
                  <li>
                    עבור כל חריג יופיע הסבר למהות החריג ובאופן הטיפול
                  </li>
                </ul>
              </div>
            </div>
          )}

          {page === 1 && (
            <div className="computer-page">
              <img
                src={logoMashan}
                alt="logoMashan"
                className="logoMashan"
              />
            </div>
          )}

          {page === 2 && (
            <div className="computer-page">
              {selectedException ? (
                <ReportDetailsScreen
                  exceptionName={selectedException}
                  progress={selectedExceptionProgress}
                  exceptionComplete={selectedExceptionComplete}
                  onExplanationViewed={handleExplanationViewed}
                  onTreatmentViewed={handleTreatmentViewed}
                  onQuestionAnswered={handleQuestionAnswered}
                  onBackToExceptions={handleBackToExceptions}
                />
              ) : (
                <InteractiveSystemScreen
                  visitedCircles={visitedCircles}
                  setVisitedCircles={setVisitedCircles}
                  tableOpen={tableOpen}
                  setTableOpen={setTableOpen}
                  completedExceptions={completedExceptions}
                  onGraphOpen={() => {
                    completeSystemStep("graph");
                    setSystemPhase("table");
                  }}
                  onReportClick={(row, index) => {
                    console.log("נלחץ דוח", row, index);

                    /*
                      שימי לב:
                      כאן כבר לא מסמנים את החריג כגמור.
                      רק פותחים אותו.
                    */
                    setSelectedException(row);
                    setSystemPhase("report");
                  }}
                />
              )}
            </div>
          )}

          {page === 3 && (
            <div className="computer-page">
              {/* כאן ייכנס השלב הבא בהמשך */}
            </div>
          )}
        </div>

        <button
          className="computer-next-btn"
          onClick={nextPage}
          disabled={nextDisabled}
        >
          הבא
        </button>

        {/*
          בזמן דו"ח פרטני הכפתור הראשי "חזור" נעלם.
          החזרה נעשית רק מהכפתור הייעודי בתוך הדו"ח.
        */}
        {!(page === 2 && selectedException) && (
          <button
            className="computer-back-btn"
            onClick={previousPage}
          >
            חזור
          </button>
        )}

        {page >= 1 && currentCharacterText && (
          <div className="computer-character">
            <img
              src={Character}
              alt=""
              className="computer-character-image"
            />

            <div className="computer-character-text">
              <p className="character-regular">
                {currentCharacterText.regular}
              </p>

              <p className="character-bold">
                {currentCharacterText.bold}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ComputerScene;
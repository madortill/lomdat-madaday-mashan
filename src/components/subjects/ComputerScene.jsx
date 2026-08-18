import React, { useEffect, useState } from "react";
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

  // בהמשך:
  // "report-details",
  // "another-button",
  // "final-action",
];

function ComputerScene({ onClose, onComplete }) {
  const [page, setPage] = useState(0);

  // נשמר כאן כדי שלא יתאפס כשחוזרים אחורה/קדימה.
  const [visitedCircles, setVisitedCircles] = useState([]);
  const [tableOpen, setTableOpen] = useState(false);
  const [selectedException, setSelectedException] = useState(null);
  const [completedExceptions, setCompletedExceptions] =
  useState([]);

  const [systemPhase, setSystemPhase] = useState("circles");
  const [completedSystemSteps, setCompletedSystemSteps] = useState([]);

  const LAST_PAGE = 3;

  const systemComplete = REQUIRED_SYSTEM_STEPS.every((step) =>
    completedSystemSteps.includes(step)
  );

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

      report: {
        regular:
          "נוכל להוציא פלט עבור כל אחד מהנושאים החריגים בנפרד.",
        bold: "המשיכו לפי ההנחיות במסך",
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

  const currentCharacterText =
    page === 2
      ? characterTexts[2]?.[systemPhase]
      : characterTexts[page];

  const completeSystemStep = (step) => {
    setCompletedSystemSteps((prev) => {
      if (prev.includes(step)) {
        return prev;
      }

      return [...prev, step];
    });
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
      אם נמצאים בתוך דו"ח פרטני,
      "חזור" מחזיר קודם לטבלת החריגים,
      בלי לאפס את ההתקדמות.
    */
    if (page === 2 && selectedException) {
      setSelectedException(null);

      if (systemComplete) {
        setSystemPhase("complete");
      } else {
        setSystemPhase("table");
      }

      return;
    }

    if (page === 0) {
      onClose?.();
      return;
    }

    setPage((prev) => prev - 1);
  };

  return (
    <div className="computer-scene">
      <div className="computer-stage">
        <img src={computerBg} alt="" className="computer-background" />

        <div className="computer-screen">
          {page === 0 && (
            <div className="computer-page intro-page">
              <p className="title-computer">קצת על המערכת</p>

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
                  <li>עבור כל חריג יופיע הסבר למהות החריג ובאופן הטיפול</li>
                </ul>
              </div>
            </div>
          )}

          {page === 1 && (
            <div className="computer-page">
              <img src={logoMashan} alt="logoMashan" className="logoMashan" />
            </div>
          )}

          {page === 2 && (
            <div className="computer-page">
              {selectedException ? (
                <ReportDetailsScreen
                  exceptionName={selectedException}
                />
              ) : (
                <InteractiveSystemScreen
                  visitedCircles={visitedCircles}
                  setVisitedCircles={setVisitedCircles}
                  tableOpen={tableOpen}
                  setTableOpen={setTableOpen}
                  onGraphOpen={() => {
                    completeSystemStep("graph");
                    setSystemPhase("table");
                  }}
                  onReportClick={(row, index) => {
                    console.log("נלחץ דוח", row, index);
                  
                    // פותחים את מסך הדוח של החריג שנבחר
                    setSelectedException(row);
                  
                    // מסמנים שהמשתמש כבר עבר על החריג הזה
                    setCompletedExceptions((prev) => {
                      // אם כבר עברו עליו בעבר - לא מוסיפים שוב
                      if (prev.includes(row)) {
                        return prev;
                      }
                  
                      return [...prev, row];
                    });
                  
                    // עוברים להוראה של הדמות במסך הדוח
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

        <button className="computer-back-btn" onClick={previousPage}>
          חזור
        </button>

        {page >= 1 && currentCharacterText && (
          <div className="computer-character">
            <img src={Character} alt="" className="computer-character-image" />

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
import React, {
  useEffect,
  useState,
} from "react";

import "./css/App.css";

import OfficeScene from "./components/OfficeScene";
import OpeningPage from "./mainPages/OpeningPage";
import EndScene from "./components/EndScene";

import tilIcon from "./assets/images/tilIcon.svg";
import bahad11Icon from "./assets/images/bahad11Icon.svg";


function App() {
  /*
    האם להציג כרגע את מסך הסיום
  */
  const [showEndScene, setShowEndScene] =
    useState(false);


  /*
    המפתח הזה מאפשר לנו לבצע
    reset מלא לכל הקומפוננטות.

    בכל פעם שמשנים אותו,
    React מוחק את OpeningPage
    ואת OfficeScene ויוצר אותם מחדש.
  */
  const [learningKey, setLearningKey] =
    useState(0);


    useEffect(() => {
      /*
        כל טעינה חדשה / Refresh
        מאפסת את ההתקדמות הזמנית.
      */
    
      sessionStorage.removeItem(
        "pens-scene-progress"
      );
    
      sessionStorage.removeItem(
        "interactive-system-tutorial-seen"
      );
    }, []);

  /* =========================
     סיום הלומדה
  ========================= */

  const handleCourseComplete = () => {
    setShowEndScene(true);
  };


  /* =========================
     לחזור ללמוד
  ========================= */

  const handleContinueLearning = () => {
    /*
      רק מסתירים את מסך הסיום.

      לא מאפסים שום דבר!

      לכן OfficeScene נשאר בדיוק
      במצב DONE וכל הנושאים פתוחים.
    */
    setShowEndScene(false);
  };


  /* =========================
     מההתחלה
  ========================= */
  const handleRestart = () => {
    /*
      איפוס ההתקדמות של העטים
    */
    sessionStorage.removeItem(
      "pens-scene-progress"
    );
  
    /*
      איפוס ההדרכה הראשונית
      של מסך המערכת
    */
    sessionStorage.removeItem(
      "interactive-system-tutorial-seen"
    );
  
    /*
      מסתירים את מסך הסיום
    */
    setShowEndScene(false);
  
    /*
      מאפסים את כל ה-useState
      בתוך הלומדה
    */
    setLearningKey(
      (prev) => prev + 1
    );
  };


  return (
    <>
      <div className="app">

        {/* =========================
            תוכן הלומדה
        ========================= */}

        <React.Fragment key={learningKey}>

          <OpeningPage />

          <OfficeScene
            onCourseComplete={
              handleCourseComplete
            }
          />

        </React.Fragment>


        {/* =========================
            לוגואים
        ========================= */}

        <img
          src={tilIcon}
          alt="tilIcon"
          className="til-icon"
        />

        <img
          src={bahad11Icon}
          alt="bahad11Icon"
          className="bahad11-icon"
        />


        {/* =========================
            מסך סיום
        ========================= */}

        {showEndScene && (
          <EndScene
            onRestart={
              handleRestart
            }

            onContinueLearning={
              handleContinueLearning
            }
          />
        )}

      </div>
    </>
  );
}


export default App;
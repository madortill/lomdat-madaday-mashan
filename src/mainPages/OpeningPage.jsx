import React, { useState } from "react";
import "../css/OpeningPage.css";
import startBtn from "../assets/images/openingPage/startBtn.svg";
import logoBahad11 from "../assets/images/openingPage/logoBahad11.svg";

function OpeningPage() {
  const [startLearning, setStartLearning] = useState(false);

  // אם לחצו על התחלה - לא מציגים יותר את עמוד הפתיחה
  if (startLearning) {
    return null;
  }

  return (
    <div className="OpeningPage">
      <div className="black-div"></div>

      <div className="lightBlue-div">
        <p className="opening-title">לומדת מדדי משא״ן</p>

        <p className="opening-text">
          ברוכים הבאים ללומדת מדדי משא״ן!
        </p>

        <img
          src={logoBahad11}
          alt="בה״ד 11"
          className="logo-bahad11"
        />

        <img
          src={startBtn}
          alt="בואו נתחיל"
          className="start-btn"
          onClick={() => setStartLearning(true)}
        />
      </div>
    </div>
  );
}

export default OpeningPage;
import React, { useState } from "react";
import "../../css/ComputerScene.css";

import computerBg from "../../assets/images/backgrounds/computer.svg";
import gearsAnimated from "../../assets/images/computer/gearsAnimated.svg";
import logoMashan from "../../assets/images/computer/logo-mashan.png";
import Character from "../../assets/images/computer/Character.svg";

function ComputerScene({ onClose, onComplete }) {
  const [page, setPage] = useState(0);
  const LAST_PAGE = 3;
  const characterTexts = {
    1: {
      regular: "בחלק הבא תלמדו ממש על המערכת עצמה!",
      bold: "לחצו על כפתור הבא",
    },
  
    2: {
      regular: "כאן יהיה ההסבר הרגיל של העמוד השני.",
      bold: "עברו על הנתונים שמופיעים במסך.",
    },
  
    3: {
      regular: "כאן יהיה ההסבר הרגיל של העמוד השלישי.",
      bold: "לחצו על הבא לסיום החלק.",
    },
  };

  const nextPage = () => {
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

        {/* הרקע הקבוע */}
        <img
          src={computerBg}
          alt=""
          className="computer-background"
        />

        {/* רק התוכן שבתוך מסך המחשב משתנה */}
        <div className="computer-screen">

        {page === 0 && (
  <div className="computer-page intro-page">
    <p className="title-computer" >קצת על המערכת</p>

    <p className="text-computer">
    חריג רשומת נוצר עקב אי -התאמה, תקלה או עבירה על חוקי הרשומת אשר דווחה למערכת הממוכנת. "מערכת מדדי משא"ן" מתעדת את חריגי הרשומת ומתעדכנת מידי יום.
    אחת לחודש יינתן ציון לכל יחידה/פיקוד על סמך החריגים בתקופה הנבחרת.
    </p>

    <p className="sec-title-computer">
      הנושאים העיקריים בהם מתמקדים חריגי רושמת הם:
    </p>

    <div className="gears">
     <img src={gearsAnimated} alt="gearsAnimated" className="gears-animated" />
    </div>
    <div className="text-computer">
  <ul >
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
              <img
                src="/images/system-screen.png"
                alt="מערכת מדדי משא״ן"
                className="system-image"
              />
            </div>
          )}

        </div>


        {/* כפתורים */}
        <button
          className="computer-next-btn"
          onClick={nextPage}
        >
          הבא
        </button>

        <button
          className="computer-back-btn"
          onClick={previousPage}
        >
          חזור
        </button>


        {/* לדוגמה - הדמות מופיעה רק במסך השני */}
        {page >= 1 && (
  <div className="computer-character">

    <img
      src={Character}
      alt=""
      className="computer-character-image"
    />

<div className="computer-character-text">
  <p className="character-regular">
    {characterTexts[page]?.regular}
  </p>

  <p className="character-bold">
    {characterTexts[page]?.bold}
  </p>
</div>

  </div>
)}

      </div>

    </div>
  );
}

export default ComputerScene;
import React from "react";
import "../css/ExceptionsTable.css";

import reportIcon from "../assets/images/report-icon.svg";

const exceptionRows = [
  "הצבה חוזרת שלא מומשה מהיחידה",
  "אי הזנה של סטטוס צעקה ונוכחות למשרתי מילואים בפוטנציאל דיווח",
  "פערים בהזנת מעקב נוכחות",
  "חסר פרטי קרוב למקרה אסון",
  "סיפוח ושמ״פ חופפים ליחידות שאינן תואמות",
  "משובצים בבלתי משובצים מעל 3 חודשים",
  "משרתי מילואים בעלי חוב מופת",
  "חסר השתתפות הוצאות נסיעה",
  "דיווח שמ״פ לסוג איוש בלתי נקרא",
  "חיילים במקצועות נהיגה בעלי שלילה באזרחות",
  "תלונות מ״צ פתוחות",
  "חיילים בעלי עיכוב מצ״ח פתוח מעל שנתיים",
  "תהליך אירוע חריג ביחידה",
  "ביצוע סיפוח מעל 70/90 יום - בייעוד עורפי/קדמי",
];

function ExceptionsTable({ onReportClick }) {
  const handleReportClick = (row, index) => {
    if (onReportClick) {
      onReportClick(row, index);
      return;
    }

    console.log("נלחץ דו״ח פרטני:", row);
  };

  return (
    <div className="exceptions-table-wrapper" dir="rtl">
      <div className="exceptions-table-scroll">
        <table className="exceptions-table">
          <thead>
            <tr>
              <th className="exception-name-column">
                שם חריג
              </th>

              <th>חריגים בזמן טיפול</th>

              <th>חריגים לציון</th>

              <th>סה״כ</th>

              <th>אחוז משקל</th>

              <th className="report-column">
                דו״ח פרטני
              </th>
            </tr>
          </thead>

          <tbody>
            <tr className="category-row">
              <td colSpan="6">
                <div className="category-row-content">
                  <span>מילואים</span>
                  <span className="category-arrow">⌄</span>
                </div>
              </td>
            </tr>

            <tr className="category-row category-row-secondary">
              <td colSpan="6">
                <div className="category-row-content">
                  <span>21-דוחות מילואים</span>
                  <span className="category-arrow">⌄</span>
                </div>
              </td>
            </tr>

            {exceptionRows.map((row, index) => (
              <tr
                className="exception-data-row"
                key={`${row}-${index}`}
              >
                <td className="exception-name-cell">
                  {row}
                </td>

                <td></td>
                <td></td>
                <td></td>
                <td></td>

                <td className="report-cell">
                  <button
                    type="button"
                    className="report-button"
                    onClick={() =>
                      handleReportClick(row, index)
                    }
                    aria-label={`פתיחת דוח פרטני עבור ${row}`}
                  >
                    <img src={reportIcon} alt="" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ExceptionsTable;
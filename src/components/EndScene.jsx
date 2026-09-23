import React, { useMemo } from "react";
import "../css/EndScene.css";

import endBackground from "../assets/images/backgrounds/end-screen.svg";
import restartButton from "../assets/images/end/restart-button.svg";
import continueButton from "../assets/images/end/continue-button.svg";

function EndScene({
  onRestart,
  onContinueLearning,
}) {
  const confettiPieces = useMemo(() => {
    const colors = [
      "#0B5A7C",
      "#2E86AB",
      "#63C7EA",
      "#DDF3FF",
      "#FFFFFF",
    ];
  
    return Array.from(
      { length: 48 },
      (_, index) => {
        const startLeft =
          18 + ((index * 13.7) % 64);
  
        const burstLeft =
          Math.max(
            2,
            Math.min(
              98,
              startLeft +
                (((index * 17) % 55) - 27)
            )
          );
  
        /* 
          הגובה שממנו כל חתיכה תתחיל ליפול
          כדי שלא יהיו באותו קו
        */
        const burstTop =
          8 + ((index * 11) % 18); // בין 8% ל-26%
  
        const width =
          0.45 +
          ((index * 7) % 8) * 0.07;
  
        const height =
          0.75 +
          ((index * 5) % 7) * 0.11;
  
        return {
          id: index,
          color:
            colors[index % colors.length],
  
          startLeft: `${startLeft}%`,
          burstLeft: `${burstLeft}%`,
          burstTop: `${burstTop}%`,
  
          width: `${width}rem`,
          height: `${height}rem`,
  
          delay: `${(index % 7) * 0.025}s`,
  
          shape:
            index % 4 === 0
              ? "circle"
              : "rect",
        };
      }
    );
  }, []);

  return (
    <div className="end-scene">
      <div className="end-scene-stage">

        {/* רקע */}
        <img
          src={endBackground}
          alt=""
          className="end-scene-background"
        />


        {/* קונפטי */}
        <div
          className="end-scene-confetti"
          aria-hidden="true"
        >
          {confettiPieces.map(
            (piece) => (
              <span
                key={piece.id}
                className={`end-scene-confetti-piece end-scene-confetti-piece--${piece.shape}`}
                style={{
                  "--start-left":
                    piece.startLeft,

                  "--burst-left":
                    piece.burstLeft,

                  "--confetti-delay":
                    piece.delay,

                  width:
                    piece.width,

                  height:
                    piece.height,

                  backgroundColor:
                    piece.color,
                }}
              />
            )
          )}
        </div>


        {/* =========================
            מההתחלה
        ========================= */}

        <button
          type="button"
          className="end-scene-button end-scene-button--restart"
          onClick={onRestart}
          aria-label="מההתחלה"
        >
          <img
            src={restartButton}
            alt="מההתחלה"
          />
        </button>


        {/* =========================
            לחזור ללמוד
        ========================= */}

        <button
          type="button"
          className="end-scene-button end-scene-button--continue"
          onClick={
            onContinueLearning
          }
          aria-label="לחזור ללמוד"
        >
          <img
            src={continueButton}
            alt="לחזור ללמוד"
          />
        </button>

      </div>
    </div>
  );
}

export default EndScene;
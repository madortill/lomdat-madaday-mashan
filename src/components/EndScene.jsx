import React from "react";
import "../css/EndScene.css";

import endBackground from "../assets/images/backgrounds/end-screen.svg";
import restartButton from "../assets/images/end/restart-button.svg";
import continueButton from "../assets/images/end/continue-button.svg";

function EndScene({
  onRestart,
  onContinueLearning,
}) {
  return (
    <div className="end-scene">
      <div className="end-scene-stage">

        {/* רקע מסך הסיום */}
        <img
          src={endBackground}
          alt=""
          className="end-scene-background"
        />


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
          onClick={onContinueLearning}
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
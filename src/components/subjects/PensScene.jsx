import React, { useEffect, useMemo, useRef, useState } from "react";
import "../../css/PensScene.css";

import pensScreenSvg from "../../assets/images/pens/pens-screen.svg?raw";
import pensCharacter from "../../assets/images/pens/pens-character.svg";

const PEN_IDS = ["yellow", "pink", "green-blue", "blue", "green"];

function PensScene({ onBack, onComplete }) {
  const [activePen, setActivePen] = useState(null);
  const [visitedPens, setVisitedPens] = useState([]);
  const svgHostRef = useRef(null);

  const completionSentRef = useRef(false);

  const allPensVisited =
    visitedPens.length === PEN_IDS.length;

  const svgMarkup = useMemo(
    () => ({
      __html: pensScreenSvg,
    }),
    []
  );

  useEffect(() => {
    const host = svgHostRef.current;
  
    if (!host) return;
  
    PEN_IDS.forEach((penId) => {
      const check = host.querySelector(`#check-${penId}`);
  
      check?.classList.toggle(
        "is-visited",
        visitedPens.includes(penId)
      );
    });
  }, [visitedPens]);


  const activatePen = (penId) => {
    if (!PEN_IDS.includes(penId)) return;

    setActivePen(penId);

    setVisitedPens((prev) => {
      if (prev.includes(penId)) {
        return prev;
      }

      return [...prev, penId];
    });
  };

  const handlePointerOver = (event) => {
    const penTarget = event.target.closest?.("[data-pen]");
    if (!penTarget) return;

    activatePen(penTarget.dataset.pen);
  };

  const handlePointerOut = (event) => {
    const penTarget = event.target.closest?.("[data-pen]");
    if (!penTarget) return;

    const nextElement = event.relatedTarget;

    if (
      nextElement instanceof Element &&
      penTarget.contains(nextElement)
    ) {
      return;
    }

    setActivePen(null);
  };

  const handleMouseLeaveScene = () => {
    setActivePen(null);
  };

  useEffect(() => {
    if (visitedPens.length !== PEN_IDS.length || completionSentRef.current) {
      return;
    }

    completionSentRef.current = true;
    onComplete?.();
  }, [visitedPens.length, onComplete]);

  return (
    <div
      className="pens-scene"
      data-active-pen={activePen ?? ""}
      dir="rtl"
    >
     
      <div className="pens-scene-stage">
  
        <div
           ref={svgHostRef}
  className="pens-scene-svg"
  dangerouslySetInnerHTML={svgMarkup}
  onPointerOver={handlePointerOver}
  onPointerOut={handlePointerOut}
        />
  
        <img
          src={pensCharacter}
          alt=""
          className="pens-scene-character"
        />
        
        <p className="title-pens">טיפים מקצועיים</p>
        {allPensVisited && (
          <button
            type="button"
            className="pens-scene-back-button"
            onClick={() => onBack?.()}
          >
            חזור
          </button>
        )}
  
      </div>
    </div>
  );
}

export default PensScene;
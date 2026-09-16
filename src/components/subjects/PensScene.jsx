import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import "../../css/PensScene.css";

import pensScreenSvg from "../../assets/images/pens/pens-screen.svg?raw";
import pensCharacterDesktop from "../../assets/images/pens/pens-character.svg";
import pensCharacterTouch from "../../assets/images/pens/pens-character-touch.svg";

const PEN_IDS = [
  "yellow",
  "pink",
  "green-blue",
  "blue",
  "green",
];

const PENS_STORAGE_KEY =
  "pens-scene-progress";

function getSavedPensProgress() {
  try {
    const saved = sessionStorage.getItem(PENS_STORAGE_KEY);

    if (!saved) {
      return { visitedPens: [], completed: false };
    }

    const parsed = JSON.parse(saved);

    return {
      visitedPens: Array.isArray(parsed.visitedPens)
        ? parsed.visitedPens.filter((penId) => PEN_IDS.includes(penId))
        : [],
      completed: parsed.completed === true,
    };
  } catch (error) {
    console.warn("לא ניתן לקרוא את התקדמות העטים:", error);
    return { visitedPens: [], completed: false };
  }
}

function PensScene({ onBack, onComplete }) {
  const savedProgressRef = useRef(getSavedPensProgress());
  const [activePen, setActivePen] = useState(null);
  const [visitedPens, setVisitedPens] = useState(
    () => savedProgressRef.current.visitedPens
  );
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const svgHostRef = useRef(null);
  const completionSentRef = useRef(savedProgressRef.current.completed);

  const allPensVisited = visitedPens.length === PEN_IDS.length;

  const svgMarkup = useMemo(
    () => ({ __html: pensScreenSvg }),
    []
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia(
      "(hover: none), (pointer: coarse)"
    );

    const updateTouchMode = () => {
      setIsTouchDevice(mediaQuery.matches);
    };

    updateTouchMode();
    mediaQuery.addEventListener?.("change", updateTouchMode);

    return () => {
      mediaQuery.removeEventListener?.("change", updateTouchMode);
    };
  }, []);

  useEffect(() => {
    sessionStorage.setItem(
      PENS_STORAGE_KEY,
      JSON.stringify({
        visitedPens,
        completed: visitedPens.length === PEN_IDS.length,
      })
    );
  }, [visitedPens]);

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
      if (prev.includes(penId)) return prev;
      return [...prev, penId];
    });
  };

  const handlePointerOver = (event) => {
    if (isTouchDevice) return;

    const penTarget = event.target.closest?.("[data-pen]");
    if (!penTarget) return;

    activatePen(penTarget.dataset.pen);
  };

  const handlePointerOut = (event) => {
    if (isTouchDevice) return;

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

  const handleClick = (event) => {
    if (!isTouchDevice) return;

    const penTarget = event.target.closest?.("[data-pen]");
    if (!penTarget) return;

    activatePen(penTarget.dataset.pen);
  };

  useEffect(() => {
    if (!allPensVisited || completionSentRef.current) return;

    completionSentRef.current = true;

    sessionStorage.setItem(
      PENS_STORAGE_KEY,
      JSON.stringify({ visitedPens, completed: true })
    );

    onComplete?.();
  }, [allPensVisited, visitedPens, onComplete]);

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
          onClick={handleClick}
        />

        <img
          src={
            isTouchDevice
              ? pensCharacterTouch
              : pensCharacterDesktop
          }
          alt=""
          className="pens-scene-character"
        />

        <p className="title-pens">
          טיפים מקצועיים
        </p>

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

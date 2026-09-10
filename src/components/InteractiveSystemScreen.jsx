import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import "../css/InteractiveSystemScreen.css";

import systemSvg from "../assets/images/computer/system-screen.svg?raw";
import ExceptionsTable from "./ExceptionsTable";

const SYSTEM_TUTORIAL_KEY = "interactive-system-tutorial-seen";

/* =========================================================
   עריכה נוחה של אזורי ההדגשה

   כל המספרים הם באחוזים מתוך מסך המערכת:
   left   = מיקום משמאל
   top    = מיקום מלמעלה
   width  = רוחב
   height = גובה

   זה המקום היחיד שצריך לערוך.
========================================================= */

const FOCUS_BOXES = {
  circles: {
    left: 49,
    top: 15,
    width: 49,
    height: 27,
    radius: 0,
  },

  graph: {
    left: 50,
    top: 42,
    width: 47,
    height: 30,
    radius: 0,
  },

  table: {
    left: 2.1,
    top: 20.5,
    width: 46.5,
    height: 78.5,
    radius: 6,
  },
};

const CIRCLE_DATA = {
  "circle-click-1": {
    glowId: "circle-glow-1",
    title: "חריגים לציון",
    text: "כאן כתבי את ההסבר שיופיע בטול-טיפ של העיגול הראשון.",
  },
  "circle-click-2": {
    glowId: "circle-glow-2",
    title: "חריגים בזמן טיפול",
    text: "כאן כתבי את ההסבר שיופיע בטול-טיפ של העיגול השני.",
  },
  "circle-click-3": {
    glowId: "circle-glow-3",
    title: "סה״כ חריגים",
    text: "כאן כתבי את ההסבר שיופיע בטול-טיפ של העיגול השלישי.",
  },
};

const CIRCLE_IDS = Object.keys(CIRCLE_DATA);

function InteractiveSystemScreen({
  visitedCircles,
  setVisitedCircles,
  tableOpen,
  setTableOpen,
  completedExceptions = [],
  onGraphOpen,
  onReportClick,
}) {
  const screenRef = useRef(null);
  const svgHostRef = useRef(null);

  const [tooltip, setTooltip] = useState(null);

  const [tutorialActive, setTutorialActive] = useState(() => {
    return sessionStorage.getItem(SYSTEM_TUTORIAL_KEY) !== "true";
  });

  const [tutorialRect, setTutorialRect] = useState(null);

  const svgMarkup = useMemo(
    () => ({
      __html: systemSvg,
    }),
    []
  );

  const allCirclesVisited = CIRCLE_IDS.every((id) =>
    visitedCircles.includes(id)
  );

  const tutorialStep = useMemo(() => {
    if (!tutorialActive) {
      return null;
    }

    if (!allCirclesVisited) {
      return "circles";
    }

    if (!tableOpen) {
      return "graph";
    }

    return "table";
  }, [
    tutorialActive,
    allCirclesVisited,
    tableOpen,
  ]);

  const markCircleAsVisited = (id) => {
    setVisitedCircles((prev) => {
      if (prev.includes(id)) {
        return prev;
      }

      return [...prev, id];
    });
  };

  const getPointerPosition = (event) => {
    const host = svgHostRef.current;

    if (!host) {
      return { x: 0, y: 0 };
    }

    const hostRect = host.getBoundingClientRect();

    return {
      x: event.clientX - hostRect.left,
      y: event.clientY - hostRect.top,
    };
  };

  /*
    אזור ההדגשה נלקח ישירות מ-FOCUS_BOXES.
    לכן אפשר לכוון אותו ידנית בקלות.
  */
  useEffect(() => {
    if (tutorialStep === null) {
      setTutorialRect(null);
      return;
    }

    const box = FOCUS_BOXES[tutorialStep];

    if (!box) {
      setTutorialRect(null);
      return;
    }

    setTutorialRect(box);
  }, [tutorialStep]);

  /*
    עיגולים
  */
  useEffect(() => {
    const host = svgHostRef.current;
    if (!host) return;

    const cleanups = [];

    Object.entries(CIRCLE_DATA).forEach(
      ([clickId, content]) => {
        const clickTarget = host.querySelector(
          `#${clickId}`
        );

        const glow = host.querySelector(
          `#${content.glowId}`
        );

        if (!clickTarget) {
          console.warn(
            `InteractiveSystemScreen: לא נמצא #${clickId} בתוך ה-SVG`
          );
          return;
        }

        clickTarget.classList.add(
          "svg-circle-click"
        );

        clickTarget.setAttribute(
          "role",
          "button"
        );

        clickTarget.setAttribute(
          "tabindex",
          "0"
        );

        clickTarget.setAttribute(
          "aria-label",
          `${content.title} - הצגת מידע`
        );

        if (glow) {
          glow.classList.add(
            "svg-glow",
            "svg-circle-glow"
          );
        }

        const stopGlowBlink = () => {
          if (!glow) return;

          glow.classList.add(
            "is-visited"
          );
        };

        const showTooltip = (event) => {
          markCircleAsVisited(
            clickId
          );

          stopGlowBlink();

          const { x, y } =
            getPointerPosition(
              event
            );

          setTooltip({
            id: clickId,
            title: content.title,
            text: content.text,
            x,
            y,
          });
        };

        const moveTooltip = (event) => {
          const { x, y } =
            getPointerPosition(
              event
            );

          setTooltip((prev) => {
            if (
              !prev ||
              prev.id !== clickId
            ) {
              return prev;
            }

            return {
              ...prev,
              x,
              y,
            };
          });
        };

        const hideTooltip = () => {
          setTooltip((prev) => {
            if (
              prev?.id === clickId
            ) {
              return null;
            }

            return prev;
          });
        };

        const handleClick = (event) => {
          showTooltip(event);
        };

        const handleKeyDown = (event) => {
          if (
            event.key !== "Enter" &&
            event.key !== " "
          ) {
            return;
          }

          event.preventDefault();

          markCircleAsVisited(
            clickId
          );

          stopGlowBlink();

          const clickRect =
            clickTarget.getBoundingClientRect();

          const hostRect =
            host.getBoundingClientRect();

          setTooltip({
            id: clickId,
            title: content.title,
            text: content.text,
            x:
              clickRect.left -
              hostRect.left +
              clickRect.width / 2,
            y:
              clickRect.top -
              hostRect.top,
          });
        };

        clickTarget.addEventListener(
          "pointerenter",
          showTooltip
        );

        clickTarget.addEventListener(
          "pointermove",
          moveTooltip
        );

        clickTarget.addEventListener(
          "pointerleave",
          hideTooltip
        );

        clickTarget.addEventListener(
          "click",
          handleClick
        );

        clickTarget.addEventListener(
          "keydown",
          handleKeyDown
        );

        cleanups.push(() => {
          clickTarget.removeEventListener(
            "pointerenter",
            showTooltip
          );

          clickTarget.removeEventListener(
            "pointermove",
            moveTooltip
          );

          clickTarget.removeEventListener(
            "pointerleave",
            hideTooltip
          );

          clickTarget.removeEventListener(
            "click",
            handleClick
          );

          clickTarget.removeEventListener(
            "keydown",
            handleKeyDown
          );
        });
      }
    );

    return () => {
      cleanups.forEach((cleanup) =>
        cleanup()
      );
    };
  }, [
    setVisitedCircles,
  ]);

  /*
    מחזיר את מצב ה-is-visited
    אחרי יציאה וחזרה.
  */
  useEffect(() => {
    const host = svgHostRef.current;
    if (!host) return;

    Object.entries(CIRCLE_DATA).forEach(
      ([clickId, content]) => {
        const glow = host.querySelector(
          `#${content.glowId}`
        );

        if (!glow) return;

        glow.classList.toggle(
          "is-visited",
          visitedCircles.includes(
            clickId
          )
        );
      }
    );
  }, [
    visitedCircles,
  ]);

  /*
    גרף
  */
  useEffect(() => {
    const host = svgHostRef.current;
    if (!host) return;

    const graphGlow =
      host.querySelector(
        "#graph-glow"
      );

    const graphClickTarget =
      host.querySelector(
        "#graph-click-target"
      );

    if (!graphClickTarget) {
      console.warn(
        "InteractiveSystemScreen: לא נמצא #graph-click-target בתוך ה-SVG"
      );
      return;
    }

    if (graphGlow) {
      graphGlow.classList.add(
        "svg-glow",
        "svg-graph-glow"
      );

      graphGlow.classList.toggle(
        "is-active",
        allCirclesVisited &&
          !tableOpen
      );
    }

    graphClickTarget.classList.toggle(
      "is-active",
      allCirclesVisited &&
        !tableOpen
    );

    graphClickTarget.setAttribute(
      "role",
      "button"
    );

    graphClickTarget.setAttribute(
      "tabindex",
      allCirclesVisited &&
        !tableOpen
        ? "0"
        : "-1"
    );

    graphClickTarget.setAttribute(
      "aria-label",
      "פתיחת טבלת החריגים"
    );

    const openTable = () => {
      if (
        !allCirclesVisited ||
        tableOpen
      ) {
        return;
      }

      setTooltip(null);
      setTableOpen(true);
      onGraphOpen?.();
    };

    const handleKeyDown = (event) => {
      if (
        event.key !== "Enter" &&
        event.key !== " "
      ) {
        return;
      }

      event.preventDefault();
      openTable();
    };

    graphClickTarget.addEventListener(
      "click",
      openTable
    );

    graphClickTarget.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      graphClickTarget.removeEventListener(
        "click",
        openTable
      );

      graphClickTarget.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [
    allCirclesVisited,
    tableOpen,
    setTableOpen,
    onGraphOpen,
  ]);

  /*
    ברגע שלוחצים בפעם הראשונה
    על דו"ח פרטני - ההדרכה נגמרת.

    כשחוזרים למסך הזה,
    הוא כבר יופיע רגיל.
  */
  const handleReportClick = (
    row,
    index
  ) => {
    if (tutorialActive) {
      sessionStorage.setItem(
        SYSTEM_TUTORIAL_KEY,
        "true"
      );

      setTutorialActive(false);
      setTutorialRect(null);
    }

    onReportClick?.(
      row,
      index
    );
  };

  return (
    <div
      ref={screenRef}
      className="interactive-system-screen"
    >
      <div
        ref={svgHostRef}
        className="interactive-system-svg"
        dangerouslySetInnerHTML={
          svgMarkup
        }
      />

      {tooltip && (
        <div
          className="system-tooltip"
          style={{
            left: tooltip.x,
            top: tooltip.y,
          }}
        >
          <p className="system-tooltip__title">
            {tooltip.title}
          </p>

          <p className="system-tooltip__text">
            {tooltip.text}
          </p>
        </div>
      )}

      {tableOpen && (
        <div className="system-table-area">
          <ExceptionsTable
            completedExceptions={
              completedExceptions
            }
            onReportClick={
              handleReportClick
            }
          />
        </div>
      )}

      {tutorialStep &&
        tutorialRect && (
          <>
            <div
              className="system-focus-overlay"
              aria-hidden="true"
            >
              {/* למעלה */}
              <div
                className="system-focus-mask"
                style={{
                  left: 0,
                  top: 0,
                  width: "100%",
                  height: `${tutorialRect.top}%`,
                }}
              />

              {/* למטה */}
              <div
                className="system-focus-mask"
                style={{
                  left: 0,
                  top: `${tutorialRect.top + tutorialRect.height}%`,
                  right: 0,
                  bottom: 0,
                }}
              />

              {/* שמאל */}
              <div
                className="system-focus-mask"
                style={{
                  left: 0,
                  top: `${tutorialRect.top}%`,
                  width: `${tutorialRect.left}%`,
                  height: `${tutorialRect.height}%`,
                }}
              />

              {/* ימין */}
              <div
                className="system-focus-mask"
                style={{
                  left: `${tutorialRect.left + tutorialRect.width}%`,
                  right: 0,
                  top: `${tutorialRect.top}%`,
                  height: `${tutorialRect.height}%`,
                }}
              />
            </div>

            <div
              className={`system-focus-highlight system-focus-highlight--${tutorialStep}`}
              style={{
                left: `${tutorialRect.left}%`,
                top: `${tutorialRect.top}%`,
                width: `${tutorialRect.width}%`,
                height: `${tutorialRect.height}%`,
                borderRadius: `${tutorialRect.radius ?? 8}px`,
              }}
              aria-hidden="true"
            />
          </>
        )}
    </div>
  );
}

export default InteractiveSystemScreen;

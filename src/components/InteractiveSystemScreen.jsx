import { useEffect, useMemo, useRef, useState } from "react";

import "../css/InteractiveSystemScreen.css";

import systemSvg from "../assets/images/computer/system-screen.svg?raw";
import ExceptionsTable from "./ExceptionsTable";

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
  const svgHostRef = useRef(null);
  const [tooltip, setTooltip] = useState(null);

  const svgMarkup = useMemo(
    () => ({
      __html: systemSvg,
    }),
    []
  );

  const allCirclesVisited = CIRCLE_IDS.every((id) =>
    visitedCircles.includes(id)
  );

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

  useEffect(() => {
    const host = svgHostRef.current;
    if (!host) return;

    const cleanups = [];

    Object.entries(CIRCLE_DATA).forEach(([clickId, content]) => {
      const clickTarget = host.querySelector(`#${clickId}`);
      const glow = host.querySelector(`#${content.glowId}`);

      if (!clickTarget) {
        console.warn(`InteractiveSystemScreen: לא נמצא #${clickId} בתוך ה-SVG`);
        return;
      }

      clickTarget.classList.add("svg-circle-click");
      clickTarget.setAttribute("role", "button");
      clickTarget.setAttribute("tabindex", "0");
      clickTarget.setAttribute("aria-label", `${content.title} - הצגת מידע`);

      if (glow) {
        glow.classList.add("svg-glow", "svg-circle-glow");
      }

      const stopGlowBlink = () => {
        if (!glow) return;
        glow.classList.add("is-visited");
      };

      const showTooltip = (event) => {
        markCircleAsVisited(clickId);
        stopGlowBlink();

        const { x, y } = getPointerPosition(event);

        setTooltip({
          id: clickId,
          title: content.title,
          text: content.text,
          x,
          y,
        });
      };

      const moveTooltip = (event) => {
        const { x, y } = getPointerPosition(event);

        setTooltip((prev) => {
          if (!prev || prev.id !== clickId) {
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
          if (prev?.id === clickId) {
            return null;
          }

          return prev;
        });
      };

      const handleClick = (event) => {
        showTooltip(event);
      };

      const handleKeyDown = (event) => {
        if (event.key !== "Enter" && event.key !== " ") {
          return;
        }

        event.preventDefault();

        markCircleAsVisited(clickId);
        stopGlowBlink();

        const clickRect = clickTarget.getBoundingClientRect();
        const hostRect = host.getBoundingClientRect();

        setTooltip({
          id: clickId,
          title: content.title,
          text: content.text,
          x: clickRect.left - hostRect.left + clickRect.width / 2,
          y: clickRect.top - hostRect.top,
        });
      };

      clickTarget.addEventListener("pointerenter", showTooltip);
      clickTarget.addEventListener("pointermove", moveTooltip);
      clickTarget.addEventListener("pointerleave", hideTooltip);
      clickTarget.addEventListener("click", handleClick);
      clickTarget.addEventListener("keydown", handleKeyDown);

      cleanups.push(() => {
        clickTarget.removeEventListener("pointerenter", showTooltip);
        clickTarget.removeEventListener("pointermove", moveTooltip);
        clickTarget.removeEventListener("pointerleave", hideTooltip);
        clickTarget.removeEventListener("click", handleClick);
        clickTarget.removeEventListener("keydown", handleKeyDown);
      });
    });

    return () => {
      cleanups.forEach((cleanup) => cleanup());
    };
  }, [setVisitedCircles]);

  // מחזיר מצב is-visited אחרי יציאה מהעמוד וחזרה אליו.
  useEffect(() => {
    const host = svgHostRef.current;
    if (!host) return;

    Object.entries(CIRCLE_DATA).forEach(([clickId, content]) => {
      const glow = host.querySelector(`#${content.glowId}`);
      if (!glow) return;

      glow.classList.toggle("is-visited", visitedCircles.includes(clickId));
    });
  }, [visitedCircles]);

  useEffect(() => {
    const host = svgHostRef.current;
    if (!host) return;

    const graphGlow = host.querySelector("#graph-glow");
    const graphClickTarget = host.querySelector("#graph-click-target");

    if (!graphClickTarget) {
      console.warn(
        "InteractiveSystemScreen: לא נמצא #graph-click-target בתוך ה-SVG"
      );
      return;
    }

    if (graphGlow) {
      graphGlow.classList.add("svg-glow", "svg-graph-glow");

      graphGlow.classList.toggle("is-active", allCirclesVisited && !tableOpen);
    }

    graphClickTarget.classList.toggle(
      "is-active",
      allCirclesVisited && !tableOpen
    );

    graphClickTarget.setAttribute("role", "button");
    graphClickTarget.setAttribute(
      "tabindex",
      allCirclesVisited && !tableOpen ? "0" : "-1"
    );
    graphClickTarget.setAttribute("aria-label", "פתיחת טבלת החריגים");

    const openTable = () => {
      if (!allCirclesVisited || tableOpen) {
        return;
      }

      setTooltip(null);
      setTableOpen(true);
      onGraphOpen?.();
    };

    const handleKeyDown = (event) => {
      if (event.key !== "Enter" && event.key !== " ") {
        return;
      }

      event.preventDefault();
      openTable();
    };

    graphClickTarget.addEventListener("click", openTable);
    graphClickTarget.addEventListener("keydown", handleKeyDown);

    return () => {
      graphClickTarget.removeEventListener("click", openTable);
      graphClickTarget.removeEventListener("keydown", handleKeyDown);
    };
  }, [allCirclesVisited, tableOpen, setTableOpen, onGraphOpen]);

  const handleReportClick = (row, index) => {
    onReportClick?.(row, index);
  };

  return (
    <div className="interactive-system-screen">
      <div
        ref={svgHostRef}
        className="interactive-system-svg"
        dangerouslySetInnerHTML={svgMarkup}
      />

      {tooltip && (
        <div
          className="system-tooltip"
          style={{
            left: tooltip.x,
            top: tooltip.y,
          }}
        >
          <p className="system-tooltip__title">{tooltip.title}</p>

          <p className="system-tooltip__text">{tooltip.text}</p>
        </div>
      )}

      {tableOpen && (
        <div className="system-table-area">
          <ExceptionsTable
            completedExceptions={completedExceptions}
            onReportClick={handleReportClick}
          />
        </div>
      )}
    </div>
  );
}

export default InteractiveSystemScreen;

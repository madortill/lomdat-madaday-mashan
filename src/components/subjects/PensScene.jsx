import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import "../../css/PensScene.css";

import pensScreenSvg from "../../assets/images/pens/pens-screen.svg?raw";
import pensCharacter from "../../assets/images/pens/pens-character.svg";


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
    const saved =
      sessionStorage.getItem(
        PENS_STORAGE_KEY
      );

    if (!saved) {
      return {
        visitedPens: [],
        completed: false,
      };
    }

    const parsed =
      JSON.parse(saved);

    return {
      visitedPens:
        Array.isArray(
          parsed.visitedPens
        )
          ? parsed.visitedPens.filter(
              (penId) =>
                PEN_IDS.includes(
                  penId
                )
            )
          : [],

      completed:
        parsed.completed === true,
    };
  } catch (error) {
    console.warn(
      "לא ניתן לקרוא את התקדמות העטים:",
      error
    );

    return {
      visitedPens: [],
      completed: false,
    };
  }
}


function PensScene({
  onBack,
  onComplete,
}) {
  const savedProgressRef =
    useRef(
      getSavedPensProgress()
    );


  const [
    activePen,
    setActivePen,
  ] = useState(null);


  const [
    visitedPens,
    setVisitedPens,
  ] = useState(
    () =>
      savedProgressRef.current
        .visitedPens
  );


  const svgHostRef =
    useRef(null);


  /*
    אם כבר סיימו בעבר,
    אנחנו לא רוצים להפעיל
    שוב את onComplete בכל כניסה.
  */
  const completionSentRef =
    useRef(
      savedProgressRef.current
        .completed
    );


  const allPensVisited =
    visitedPens.length ===
    PEN_IDS.length;


  const svgMarkup =
    useMemo(
      () => ({
        __html:
          pensScreenSvg,
      }),
      []
    );


  /* =========================================
     שמירה ב-sessionStorage
  ========================================= */

  useEffect(() => {
    sessionStorage.setItem(
      PENS_STORAGE_KEY,
      JSON.stringify({
        visitedPens,

        completed:
          visitedPens.length ===
          PEN_IDS.length,
      })
    );
  }, [
    visitedPens,
  ]);


  /* =========================================
     סימוני V בתוך ה-SVG
  ========================================= */

  useEffect(() => {
    const host =
      svgHostRef.current;

    if (!host) {
      return;
    }


    PEN_IDS.forEach(
      (penId) => {
        const check =
          host.querySelector(
            `#check-${penId}`
          );


        check?.classList.toggle(
          "is-visited",
          visitedPens.includes(
            penId
          )
        );
      }
    );
  }, [
    visitedPens,
  ]);


  /* =========================================
     הפעלת עט
  ========================================= */

  const activatePen = (
    penId
  ) => {
    if (
      !PEN_IDS.includes(
        penId
      )
    ) {
      return;
    }


    setActivePen(
      penId
    );


    setVisitedPens(
      (prev) => {
        if (
          prev.includes(
            penId
          )
        ) {
          return prev;
        }


        return [
          ...prev,
          penId,
        ];
      }
    );
  };


  /* =========================================
     Hover
  ========================================= */

  const handlePointerOver =
    (event) => {
      const penTarget =
        event.target.closest?.(
          "[data-pen]"
        );


      if (!penTarget) {
        return;
      }


      activatePen(
        penTarget.dataset.pen
      );
    };


  const handlePointerOut =
    (event) => {
      const penTarget =
        event.target.closest?.(
          "[data-pen]"
        );


      if (!penTarget) {
        return;
      }


      const nextElement =
        event.relatedTarget;


      if (
        nextElement instanceof
          Element &&
        penTarget.contains(
          nextElement
        )
      ) {
        return;
      }


      setActivePen(
        null
      );
    };


  /* =========================================
     סיום כל העטים
  ========================================= */

  useEffect(() => {
    if (
      !allPensVisited ||
      completionSentRef.current
    ) {
      return;
    }


    completionSentRef.current =
      true;


    sessionStorage.setItem(
      PENS_STORAGE_KEY,
      JSON.stringify({
        visitedPens,
        completed: true,
      })
    );


    onComplete?.();
  }, [
    allPensVisited,
    visitedPens,
    onComplete,
  ]);


  return (
    <div
      className="pens-scene"
      data-active-pen={
        activePen ?? ""
      }
      dir="rtl"
    >

      <div className="pens-scene-stage">

        <div
          ref={
            svgHostRef
          }
          className="pens-scene-svg"
          dangerouslySetInnerHTML={
            svgMarkup
          }
          onPointerOver={
            handlePointerOver
          }
          onPointerOut={
            handlePointerOut
          }
        />


        <img
          src={
            pensCharacter
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
            onClick={() =>
              onBack?.()
            }
          >
            חזור
          </button>
        )}

      </div>
    </div>
  );
}


export default PensScene;
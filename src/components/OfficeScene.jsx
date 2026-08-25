import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import officeSvg from "../assets/images/backgrounds/office-interactive.svg?raw";
import "../css/OfficeScene.css";

import Notebook from "../components/subjects/Notebook";
import ComputerScene from "../components/subjects/ComputerScene";
import PensScene from "../components/subjects/PensScene";


const STEPS = {
  NOTEBOOK: 0,
  COMPUTER: 1,
  PENS: 2,
  DONE: 3,
};


function OfficeScene({
  onNotebookClick,
  onComputerClick,
  onPensClick,
}) {
  const [step, setStep] =
    useState(STEPS.NOTEBOOK);

  const [isNotebookOpen, setIsNotebookOpen] =
    useState(false);

  const [computerOpen, setComputerOpen] =
    useState(false);

  const [pensOpen, setPensOpen] =
    useState(false);

  const svgHostRef = useRef(null);


  // ה-SVG הוא קובץ מקומי של הפרויקט
  const svgMarkup = useMemo(
    () => ({
      __html: officeSvg,
    }),
    []
  );


  useEffect(() => {
    const host = svgHostRef.current;

    if (!host) {
      return;
    }


    /* =========================
       אלמנטים מתוך ה-SVG
    ========================= */

    const notebook =
      host.querySelector(
        "#notebook-highlight"
      );

    const computer =
      host.querySelector(
        "#computer-stage"
      );

    const computerClickTarget =
      host.querySelector(
        "#computer-click-target"
      );

    const pens =
      host.querySelector(
        "#pens-highlight"
      );

    const instructionBox =
      host.querySelector(
        "#instruction-box"
      );

    const notebookInstruction =
      host.querySelector(
        "#notebook-instruction"
      );

    const pensInstruction =
      host.querySelector(
        "#pens-instruction"
      );


    if (
      !notebook ||
      !computer ||
      !computerClickTarget ||
      !pens
    ) {
      console.warn(
        "OfficeScene: one or more interactive SVG elements were not found."
      );

      return;
    }


    /* =========================
       נראות לפי השלב
    ========================= */

    notebook.classList.toggle(
      "is-hidden",
      false
    );

    computer.classList.toggle(
      "is-hidden",
      step < STEPS.COMPUTER
    );

    pens.classList.toggle(
      "is-hidden",
      step < STEPS.PENS
    );


    /* =========================
       בועת ההוראות
    ========================= */

    const showInstructionBox =
      step === STEPS.NOTEBOOK ||
      step === STEPS.PENS;


    if (instructionBox) {
      instructionBox.style.display =
        showInstructionBox
          ? "block"
          : "none";
    }


    if (notebookInstruction) {
      notebookInstruction.style.display =
        step === STEPS.NOTEBOOK
          ? "block"
          : "none";
    }


    if (pensInstruction) {
      pensInstruction.style.display =
        step === STEPS.PENS
          ? "block"
          : "none";
    }


    /* =========================
       מה לחיץ
    ========================= */

    // המחברת תמיד יכולה להיפתח שוב
    notebook.classList.add(
      "is-clickable"
    );


    // המחשב פתוח משלב COMPUTER והלאה
    computerClickTarget.classList.toggle(
      "is-clickable",
      step >= STEPS.COMPUTER
    );


    // העטים פתוחים משלב PENS והלאה
    pens.classList.toggle(
      "is-clickable",
      step >= STEPS.PENS
    );


    /* =========================
       הבהוב
    ========================= */

    notebook.classList.toggle(
      "is-blinking",
      step === STEPS.NOTEBOOK
    );


    pens.classList.toggle(
      "is-blinking",
      step === STEPS.PENS
    );


    /* =========================
       לחיצה על המחברת
    ========================= */

    const handleNotebookClick = () => {
      // תמיד ניתן לפתוח שוב
      setIsNotebookOpen(true);


      // רק בפעם הראשונה מתקדמים למחשב
      if (step === STEPS.NOTEBOOK) {
        onNotebookClick?.();

        setStep(
          STEPS.COMPUTER
        );
      }
    };


    /* =========================
       לחיצה על המחשב
    ========================= */

    const handleComputerClick = () => {
      if (
        step < STEPS.COMPUTER
      ) {
        return;
      }

      setComputerOpen(true);

      onComputerClick?.();
    };


    /* =========================
       לחיצה על העטים
    ========================= */

    const handlePensClick = () => {
      if (
        step < STEPS.PENS
      ) {
        return;
      }

      /*
        כאן לא מסמנים DONE.

        אנחנו רק פותחים את PensScene.

        רק אחרי שעברו על כל
        חמשת העטים PensScene
        יודיע לנו שהוא הסתיים.
      */
      setPensOpen(true);

      onPensClick?.();
    };


    /* =========================
       Event listeners
    ========================= */

    notebook.addEventListener(
      "click",
      handleNotebookClick
    );

    computerClickTarget.addEventListener(
      "click",
      handleComputerClick
    );

    pens.addEventListener(
      "click",
      handlePensClick
    );


    /* =========================
       Cleanup
    ========================= */

    return () => {
      notebook.removeEventListener(
        "click",
        handleNotebookClick
      );

      computerClickTarget.removeEventListener(
        "click",
        handleComputerClick
      );

      pens.removeEventListener(
        "click",
        handlePensClick
      );
    };
  }, [
    step,
    onNotebookClick,
    onComputerClick,
    onPensClick,
  ]);


  return (
    <div className="office-scene">

      {/* =========================
          מסך המשרד
      ========================= */}

      <div
        ref={svgHostRef}
        className="office-scene__svg"
        dangerouslySetInnerHTML={
          svgMarkup
        }
      />


      {/* =========================
          מחברת
      ========================= */}

      {isNotebookOpen && (
        <Notebook
          onClose={() =>
            setIsNotebookOpen(false)
          }
        />
      )}


      {/* =========================
          מחשב
      ========================= */}

      {computerOpen && (
        <ComputerScene
          onClose={() => {
            setComputerOpen(false);
          }}

          onComplete={() => {
            setComputerOpen(false);

            /*
              אחרי שמסיימים את המחשב
              נפתח שלב העטים.
            */
            if (
              step < STEPS.PENS
            ) {
              setStep(
                STEPS.PENS
              );
            }
          }}
        />
      )}


      {/* =========================
          עטים
      ========================= */}

      {pensOpen && (
       <PensScene
       onBack={() => {
         setPensOpen(false);
       }}
     
       onComplete={() => {
         if (step < STEPS.DONE) {
           setStep(STEPS.DONE);
         }
       }}
     />
      )}

    </div>
  );
}


export default OfficeScene;
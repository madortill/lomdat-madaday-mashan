import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import officeSvg from "../assets/images/backgrounds/office-interactive.svg?raw";
import arrowRight from "../assets/images/arrow-right.png";

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
  onCourseComplete,
}) {
  const [step, setStep] =
    useState(STEPS.NOTEBOOK);

  const [isNotebookOpen, setIsNotebookOpen] =
    useState(false);

  const [computerOpen, setComputerOpen] =
    useState(false);

  const [pensOpen, setPensOpen] =
    useState(false);

  const [computerWasClicked, setComputerWasClicked] =
    useState(false);

  const svgHostRef = useRef(null);

  const svgMarkup = useMemo(
    () => ({
      __html: officeSvg,
    }),
    []
  );

  const officeContentOpen =
    isNotebookOpen ||
    computerOpen ||
    pensOpen;

  const showNotebookArrow =
    step === STEPS.NOTEBOOK &&
    !officeContentOpen;

  const showComputerArrow =
    step === STEPS.COMPUTER &&
    !officeContentOpen;

  const showPensArrow =
    step === STEPS.PENS &&
    !officeContentOpen;


  useEffect(() => {
    const host = svgHostRef.current;

    if (!host) {
      return;
    }

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

    const outerGearGlow =
      host.querySelector(
        "#computer-gear-outer-glow"
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


    notebook.classList.add(
      "is-clickable"
    );


    computerClickTarget.classList.toggle(
      "is-clickable",
      step >= STEPS.COMPUTER
    );


    pens.classList.toggle(
      "is-clickable",
      step >= STEPS.PENS
    );


    notebook.classList.toggle(
      "is-blinking",
      step === STEPS.NOTEBOOK
    );

    notebook.classList.toggle(
      "is-completed-glow",
      step > STEPS.NOTEBOOK
    );


    outerGearGlow?.classList.toggle(
      "is-active",
      step === STEPS.COMPUTER &&
        !computerWasClicked
    );

    outerGearGlow?.classList.toggle(
      "is-static",
      computerWasClicked
    );


    pens.classList.toggle(
      "is-blinking",
      step === STEPS.PENS
    );

    pens.classList.toggle(
      "is-completed-glow",
      step > STEPS.PENS
    );


    const handleNotebookClick = () => {
      setIsNotebookOpen(true);

      if (step === STEPS.NOTEBOOK) {
        onNotebookClick?.();

        setStep(
          STEPS.COMPUTER
        );
      }
    };


    const handleComputerClick = () => {
      if (
        step < STEPS.COMPUTER
      ) {
        return;
      }

      setComputerWasClicked(true);

      onComputerClick?.();

      setComputerOpen(true);
    };


    const handlePensClick = () => {
      if (
        step < STEPS.PENS
      ) {
        return;
      }

      setPensOpen(true);

      onPensClick?.();
    };


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
    computerWasClicked,
    onNotebookClick,
    onComputerClick,
    onPensClick,
  ]);


  return (
    <div className="office-scene">

      <div className="office-scene__stage">

        <div
          ref={svgHostRef}
          className="office-scene__svg"
          dangerouslySetInnerHTML={
            svgMarkup
          }
        />

        {showNotebookArrow && (
          <div
            className="
              office-guide-arrow
              office-guide-arrow--notebook
            "
            aria-hidden="true"
          >
            <img
              src={arrowRight}
              alt=""
            />
          </div>
        )}

        {showComputerArrow && (
          <div
            className="
              office-guide-arrow
              office-guide-arrow--computer
            "
            aria-hidden="true"
          >
            <img
              src={arrowRight}
              alt=""
            />
          </div>
        )}

        {showPensArrow && (
          <div
            className="
              office-guide-arrow
              office-guide-arrow--pens
            "
            aria-hidden="true"
          >
            <img
              src={arrowRight}
              alt=""
            />
          </div>
        )}

      </div>


      {isNotebookOpen && (
        <Notebook
          onClose={() =>
            setIsNotebookOpen(false)
          }
        />
      )}


      {computerOpen && (
        <ComputerScene
          onClose={() => {
            setComputerOpen(false);
          }}

          onComplete={() => {
            setComputerOpen(false);

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


      {pensOpen && (
        <PensScene
          onBack={() => {
            setPensOpen(false);

            if (
              step === STEPS.DONE
            ) {
              onCourseComplete?.();
            }
          }}

          onComplete={() => {
            if (
              step < STEPS.DONE
            ) {
              setStep(
                STEPS.DONE
              );
            }
          }}
        />
      )}

    </div>
  );
}


export default OfficeScene;

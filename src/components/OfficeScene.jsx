import { useEffect, useMemo, useRef, useState } from "react";
import officeSvg from "../assets/images/backgrounds/office-interactive.svg?raw";
import "../css/OfficeScene.css";
import Notebook from "../components/subjects/Notebook";
import ComputerScene from "../components/subjects/ComputerScene";

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
  const [step, setStep] = useState(STEPS.NOTEBOOK);
  const [isNotebookOpen, setIsNotebookOpen] = useState(false);
  const svgHostRef = useRef(null);
  const [computerOpen, setComputerOpen] = useState(false);

  // The SVG is a local trusted project asset.
  const svgMarkup = useMemo(() => ({ __html: officeSvg }), []);

  useEffect(() => {
    const host = svgHostRef.current;
    if (!host) return;

    const notebook = host.querySelector("#notebook-highlight");
    const computer = host.querySelector("#computer-stage");
    const computerClickTarget = host.querySelector("#computer-click-target");
    const pens = host.querySelector("#pens-highlight");
    const instructionBox = host.querySelector("#instruction-box");
const notebookInstruction = host.querySelector("#notebook-instruction");
const pensInstruction = host.querySelector("#pens-instruction");

    if (!notebook || !computer || !computerClickTarget || !pens) {
      console.warn("OfficeScene: one or more interactive SVG elements were not found.");
      return;
    }

   // Visibility by stage
notebook.classList.toggle("is-hidden", false);
computer.classList.toggle("is-hidden", step < STEPS.COMPUTER);
pens.classList.toggle("is-hidden", step < STEPS.PENS);


// Instruction box
const showInstructionBox =
  step === STEPS.NOTEBOOK ||
  step === STEPS.PENS;

instructionBox.style.display =
  showInstructionBox ? "block" : "none";


// Which text should appear inside the box
notebookInstruction.style.display =
  step === STEPS.NOTEBOOK ? "block" : "none";

pensInstruction.style.display =
  step === STEPS.PENS ? "block" : "none";

    // Only the current action is clickable.
    notebook.classList.add("is-clickable");
    computerClickTarget.classList.toggle(
      "is-clickable",
      step >= STEPS.COMPUTER
    );
    pens.classList.toggle(
      "is-clickable",
      step >= STEPS.PENS
    );

    // Blink only when the item is currently waiting for a click.
    notebook.classList.toggle("is-blinking", step === STEPS.NOTEBOOK);
    pens.classList.toggle("is-blinking", step === STEPS.PENS);

    const handleNotebookClick = () => {
      // תמיד אפשר לפתוח את המחברת
      setIsNotebookOpen(true);
    
      // רק בפעם הראשונה ממשיכים לשלב המחשב
      if (step === STEPS.NOTEBOOK) {
        onNotebookClick?.();
        setStep(STEPS.COMPUTER);
      }
    };

    const handleComputerClick = () => {
      if (step < STEPS.COMPUTER) return;
    
      setComputerOpen(true);
    };

    const handlePensClick = () => {
      if (step < STEPS.PENS) return;
    
      onPensClick?.();
    
      if (step === STEPS.PENS) {
        setStep(STEPS.DONE);
      }
    };

    notebook.addEventListener("click", handleNotebookClick);
    computerClickTarget.addEventListener("click", handleComputerClick);
    pens.addEventListener("click", handlePensClick);

    return () => {
      notebook.removeEventListener("click", handleNotebookClick);
      computerClickTarget.removeEventListener("click", handleComputerClick);
      pens.removeEventListener("click", handlePensClick);
    };
  }, [step, onNotebookClick, onComputerClick, onPensClick]);

  return (
    <div className="office-scene">
      <div
        ref={svgHostRef}
        className="office-scene__svg"
        dangerouslySetInnerHTML={svgMarkup}
      />
  
      {isNotebookOpen && (
        <Notebook
          onClose={() => setIsNotebookOpen(false)}
        />
      )}
      {computerOpen && (
  <ComputerScene
    onClose={() => {
      setComputerOpen(false);
    }}
    onComplete={() => {
      setComputerOpen(false);

      if (step < STEPS.PENS) {
        setStep(STEPS.PENS);
      }
    }}
  />
)}
    </div>
  );
}

export default OfficeScene;
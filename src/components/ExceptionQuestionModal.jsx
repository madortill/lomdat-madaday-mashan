import { useState } from "react";

function ExceptionQuestionModal({
  exceptionName,
  initialAnswer = "",
  onSubmit,
}) {
  const [answer, setAnswer] = useState(initialAnswer);
  const [showConfirm, setShowConfirm] = useState(false);

  const trimmedAnswer = answer.trim();
  const canSubmit = trimmedAnswer.length > 0;
  

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!canSubmit) {
      return;
    }

    onSubmit?.(trimmedAnswer);
  };

  return (
    <div className="exception-question-overlay" dir="rtl">
      <form
        className="exception-question-modal"
        onSubmit={handleSubmit}
      >
        <div className="exception-question-header">
          איך מטפלים בחריג?
        </div>

        <div className="exception-question-body">
          <textarea
            className="exception-question-textarea"
            value={answer}
            onChange={(event) => setAnswer(event.target.value)}
            placeholder="הסבר בפירוט...."
            aria-label={`תשובה לשאלה עבור ${exceptionName}`}
            autoFocus
          />
          <p className="exception-question-warning">
  שימו לב: לאחר הגשת התשובה לא יהיה ניתן לערוך אותה.
</p>

<button
  type="button"
  className="exception-question-submit"
  disabled={!canSubmit}
  onClick={() => setShowConfirm(true)}
>
  הגש
</button>
        </div>
      </form>
      {showConfirm && (
  <div className="question-confirm-overlay">
    <div className="question-confirm-box">
      <p className="question-confirm-title">
        האם אתם בטוחים שברצונכם להגיש?
      </p>

      <p className="question-confirm-text">
        לאחר ההגשה לא יהיה ניתן לערוך את התשובה.
      </p>

      <div className="question-confirm-buttons">
        <button
          type="button"
          className="question-confirm-cancel"
          onClick={() => setShowConfirm(false)}
        >
          ביטול
        </button>

        <button
          type="button"
          className="question-confirm-submit"
          onClick={() => {
            setShowConfirm(false);
            onSubmit?.(trimmedAnswer);
          }}
        >
          הגש
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
}

export default ExceptionQuestionModal;

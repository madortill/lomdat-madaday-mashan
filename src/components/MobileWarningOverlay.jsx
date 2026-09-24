import { useEffect, useState } from "react";
import "../css/MobileWarningOverlay.css";

function MobileWarningOverlay({
  breakpoint = 700,
  title = "הלומדה אינה מותאמת לטלפון",
  message = "יש לפתוח את הלומדה במחשב או בטאבלט ולהפוך על הצד",
  icon = "💻",
}) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= breakpoint);
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);

    return () => window.removeEventListener("resize", checkIfMobile);
  }, [breakpoint]);

  if (!isMobile) return null;

  return (
    <div className="mobile-overlay">
      <div className="mobile-overlay-card">
        <div className="mobile-overlay-icon">{icon}</div>
        <h1 className="mobile-overlay-title">{title}</h1>
        <p className="mobile-overlay-text">{message}</p>
      </div>
    </div>
  );
}

export default MobileWarningOverlay;
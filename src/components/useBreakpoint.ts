import { useEffect, useState } from "react";

export function useBreakpoint(): number {
  const [months, setMonths] = useState(1);

  useEffect(() => {
    const checkSize = () => {
      const width = window.innerWidth;
      if (width >= 1280) setMonths(4); // xl
      else if (width >= 1024) setMonths(3); // lg
      else if (width >= 768) setMonths(2); // md
      else setMonths(1); // default
    };

    checkSize();
    window.addEventListener("resize", checkSize);
    return () => window.removeEventListener("resize", checkSize);
  }, []);

  return months;
}

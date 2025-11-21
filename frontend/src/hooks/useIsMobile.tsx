import { useEffect, useState } from "react";

export function useIsMobile(breakpoint: number = 768) {
  const [isMobile, setIsMobile] = useState<boolean>(
    typeof window !== "undefined" ? window.innerWidth < breakpoint : false
  );

  useEffect(() => {
    const handleRezize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleRezize);
    return () => window.removeEventListener("resize", handleRezize);
  }, [breakpoint]);

  return isMobile;
}

import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    console.log("SlimFile ScrollToTop test:", pathname);
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    console.log("SlimFile ScrollToTop test:", pathname);

    // Scroll to top on route change
    window.scrollTo(0, 0);

    // Handle hash-based scrolling (e.g., #hero)
    if (hash === "#hero") {
      setTimeout(() => {
        const el = document.getElementById("hero");
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100); // Small delay to allow component to render
    }
  }, [pathname, hash]);

  return null;
}

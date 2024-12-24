import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // List of routes to ignore scrolling
    const ignoredRoutes = [, "/products"];

    // Check if the current route is in the ignored list
    const isIgnored = ignoredRoutes.some((route) => pathname.startsWith(route));

    if (!isIgnored) {
      // Scroll to top for all routes except ignored ones
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  return null;
};

export default ScrollToTop;

import { useState, useEffect } from "react";

const useThemeDetector = () => {
  const getCurrentTheme = () =>
    document.documentElement.classList.contains("dark");

  const [isDarkTheme, setIsDarkTheme] = useState(getCurrentTheme());

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDarkTheme(getCurrentTheme());
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  return isDarkTheme;
};

export default useThemeDetector;

import { useEffect } from "react";
import { useThemeStore } from "../../store/themeStore";
import { themes } from "./themes";

export const useTheme = () => {
  const { theme } = useThemeStore();

  useEffect(() => {
    const root = document.documentElement;

    const getSystemTheme = () =>
      window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

    // Logic to determine which color palette to apply
    const activeThemeName = theme === "system" ? getSystemTheme() : theme;

    // Find the theme object (case-insensitive)
    const activeTheme = themes.find(
      (t) => t.name.toLowerCase() === activeThemeName.toLowerCase()
    );

    if (!activeTheme) return;

    //  Handle Tailwind's dark mode class
    root.classList.toggle("dark", activeThemeName.toLowerCase() === "dark");

    //  Inject CSS Variables
    Object.entries(activeTheme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });

    // Update Browser UI
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute("content", activeTheme.colors.background);
    }

    // System Listener
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const listener = () => {
      if (theme === "system") {
        const newTheme = getSystemTheme();
        root.classList.toggle("dark", newTheme === "dark");
        // Re-apply colors if system theme changes
        const sysThemeObj = themes.find((t) => t.name.toLowerCase() === newTheme);
        if (sysThemeObj) {
          Object.entries(sysThemeObj.colors).forEach(([key, val]) => {
            root.style.setProperty(`--color-${key}`, val);
          });
        }
      }
    };

    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [theme]);
};
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { ThemeName } from "../components/hooks/themes";

export type ThemeMode = ThemeName | "system";

interface ThemeStore {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      theme: "system",
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: "theme-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

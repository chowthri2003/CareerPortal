import { useState, useRef, useEffect } from "react";
import { Sun, Moon, Monitor, Palette, Check } from "lucide-react";
import { useThemeStore,type ThemeMode } from "../../store/themeStore";
import { themes } from "../hooks/themes";

export default function ThemeToggle() {
  const { theme, setTheme } = useThemeStore();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const systemOptions: { name: ThemeMode; icon: any }[] = [
    { name: "light", icon: Sun },
    { name: "dark", icon: Moon },
    { name: "system", icon: Monitor },
  ];

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
      >
        <Palette size={18} className="text-indigo-500" />
        <span className="capitalize text-sm font-medium dark:text-slate-200">{theme}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-xl bg-white dark:bg-slate-900 shadow-xl border border-slate-200 dark:border-slate-700 z-50 overflow-hidden">
          <div className="p-2 grid grid-cols-1 gap-1">
            
            <div className="px-2 py-1 text-xs font-semibold text-slate-400 uppercase">Mode</div>
            {systemOptions.map((opt) => (
              <button
                key={opt.name}
                onClick={() => { setTheme(opt.name); setIsOpen(false); }}
                className={`flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors ${
                  theme === opt.name 
                    ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300" 
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <div className="flex items-center gap-3">
                  <opt.icon size={16} />
                  <span className="capitalize">{opt.name}</span>
                </div>
                {theme === opt.name && <Check size={14} />}
              </button>
            ))}

            <div className="h-px bg-slate-200 dark:bg-slate-700 my-1" />
            
            <div className="px-2 py-1 text-xs font-semibold text-slate-400 uppercase">Custom Themes</div>
            <div className="max-h-60 overflow-y-auto">
              {themes.filter(t => !["Light", "Dark"].includes(t.name)).map((t) => (
                <button
                  key={t.name}
                  onClick={() => { setTheme(t.name as ThemeMode); setIsOpen(false); }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors ${
                    theme === t.name 
                      ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300" 
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-3 h-3 rounded-full border border-black/10" 
                      style={{ backgroundColor: t.colors.accent }} 
                    />
                    <span>{t.name}</span>
                  </div>
                  {theme === t.name && <Check size={14} />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
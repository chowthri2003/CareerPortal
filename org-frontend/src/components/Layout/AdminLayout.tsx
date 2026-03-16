import { useState } from "react";
import { Outlet, NavLink, useLocation, Link } from "react-router-dom";
import ThemeToggle from "../hooks/themeToggle";
import { useTheme } from "../hooks/useTheme";
import { LayoutDashboard, Briefcase, Users, ShieldUser, ChevronLeft, Menu, ChevronRight } from "lucide-react";
import { useMsal } from "@azure/msal-react";
import LogoutButton from "../logoutButton";
import { useAuthStore } from "../../store/authStore";

interface NavItem {
  to: string;
  icon: React.ReactNode;
  label: string;
  end?: boolean;
  roles: ("admin" | "hr")[];
}

const navItems: NavItem[] = [
  { to: "/", icon: <LayoutDashboard size={20} />, label: "Dashboard", end: true, roles: ["admin", "hr"] },
  { to: "/jobs", icon: <Briefcase size={20} />, label: "Job Postings", roles: ["admin", "hr"] },
  { to: "/applications", icon: <Users size={20} />, label: "Applications", roles: ["hr"] },
  { to: "/users", icon: <ShieldUser size={25} />, label: "Users", roles: ["admin"] },
];

export default function AdminLayout() {
  useTheme(); 
  
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { accounts } = useMsal();
  const user = useAuthStore((state) => state.user);

  const pathnames = location.pathname.split("/").filter((x) => x);

  return (
    <div
      className="flex h-screen transition-all duration-500 overflow-hidden font-sans"
      style={{
        background: "var(--color-background)",
        color: "var(--color-text)",
      }}
    >
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
      <aside
        className={`
          fixed inset-y-0 left-0 z-40 transition-all duration-300 ease-in-out
          lg:relative lg:translate-x-0
          ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          ${collapsed ? "lg:w-20" : "lg:w-72"}
        `}
        style={{
          backgroundColor: "var(--color-primary)",
          borderColor: "var(--color-primaryBorder)",
          borderRightWidth: "1px"
        }}
      >
        <div className="flex flex-col h-full">
          <div className={`flex items-center h-20 px-6 ${collapsed ? "justify-center" : "justify-between"}`}>
            {(!collapsed || mobileOpen) && (
              <div className="flex items-center gap-3">
                <div 
                  className="w-9 h-9 rounded-xl flex items-center justify-center shadow-lg"
                  style={{ backgroundColor: "var(--color-accent)" }}
                >
                  <span className="text-white font-black text-sm">M</span>
                </div>
                <span className="text-lg font-bold tracking-tight" style={{ color: "var(--color-text)" }}>
                  Mavens Admin
                </span>
              </div>
            )}

            <button
              className="hidden lg:flex p-1.5 rounded-lg transition-all border"
              style={{ 
                backgroundColor: "var(--color-primaryLight)", 
                borderColor: "var(--color-primaryBorder)",
                color: "var(--color-accent)"
              }}
              onClick={() => setCollapsed((p) => !p)}
            >
              <ChevronLeft size={18} className={`transition-transform duration-500 ${collapsed ? "rotate-180" : ""}`} />
            </button>
          </div>

          <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
            {navItems
              .filter(item => !user || item.roles.includes(user.role))
              .map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={() => setMobileOpen(false)}
                className={ `
                  flex items-center gap-3 rounded-xl text-sm font-medium transition-all duration-200
                  ${collapsed && !mobileOpen ? "justify-center px-0 py-3" : "px-4 py-3"}
                `}
                style={({ isActive }) => ({
                  backgroundColor: isActive ? "var(--color-accent)" : "transparent",
                  color: isActive ? "#ffffff" : "var(--color-text)",
                  opacity: isActive ? 1 : 0.7
                })}
              >
                <span className="flex-shrink-0">{item.icon}</span>
                {(!collapsed || mobileOpen) && <span>{item.label}</span>}
              </NavLink>
            ))}
          </nav>
          <div className="p-4 mt-auto border-t" style={{ borderColor: "var(--color-primaryBorder)" }}>
            <div 
              className={`flex items-center justify-between p-2 rounded-xl transition-colors hover:bg-black/5 dark:hover:bg-white/5`}
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-xs flex-shrink-0 shadow-sm">
                  {user?.email?.charAt(0).toUpperCase() || accounts[0]?.username?.charAt(0).toUpperCase() || "U"}
                </div>
                {(!collapsed || mobileOpen) && (
                  <div className="overflow-hidden leading-tight">
                    <p className="text-sm font-semibold truncate" style={{ color: "var(--color-text)" }}>
                      {accounts[0]?.name || accounts[0]?.username?.split("@")[0] || "User"}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate font-medium">
                      {user?.role ? user.role.toUpperCase() : "..."}
                    </p>
                  </div>
                )}
              </div>
              {(!collapsed || mobileOpen) && <LogoutButton />}
            </div>
          </div>
        </div>
      </aside>
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <header 
          className="h-20 backdrop-blur-md border-b flex items-center justify-between px-6 lg:px-10 flex-shrink-0 z-20"
          style={{ 
            backgroundColor: "var(--color-primary)", 
            borderColor: "var(--color-primaryBorder)",
            opacity: 0.95
          }}
        >
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden p-2 rounded-lg"
              style={{ color: "var(--color-text)" }}
              onClick={() => setMobileOpen(true)}
            >
              <Menu size={22} />
            </button>
            
            <nav className="hidden sm:flex items-center text-sm font-medium">
              <ol className="flex items-center space-x-2">
                <li style={{ color: "var(--color-text)", opacity: 0.5 }}></li>
                {pathnames.map((value, index) => {
                  const to = `/${pathnames.slice(0, index + 1).join("/")}`;
                  const label = value.charAt(0).toUpperCase() + value.slice(1).replace(/-/g, ' ');

                  return (
                    <li key={to} className="flex items-center">
                      <ChevronRight size={14} className="mx-2 opacity-30" />
                      <Link to={to} className="transition-colors" style={{ color: "var(--color-accent)" }}>
                        {label}
                      </Link>
                    </li>
                  );
                })}
              </ol>
            </nav>
          </div>

          <div className="flex items-center gap-4"
           style={{ backgroundColor: "var(--color-secondary)" }}>
            <ThemeToggle />
          </div>
        </header>
        <div 
          className="flex-1 overflow-y-auto p-4 md:p-8 transition-all duration-500"
          style={{ backgroundColor: "var(--color-secondary)" }}
        >
          <div className="max-w-7xl mx-auto">
            <div 
              className="rounded-2xl border shadow-sm overflow-hidden min-h-[calc(100vh-12rem)]"
              style={{ 
                backgroundColor: "var(--color-background)", 
                borderColor: "var(--color-primaryBorder)" 
              }}
            >
              <div className="p-6 md:p-8">
                <Outlet />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
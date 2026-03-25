import { useMsal } from "@azure/msal-react";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  const { instance } = useMsal();

  const logout = () => {
    instance.logoutRedirect({
      postLogoutRedirectUri: import.meta.env.VITE_REDIRECT_URI || "http://localhost:5173" + "/sign-in",
    });
  };

  return (
    <button
      onClick={logout}
      className="p-2 rounded-lg transition-colors hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/30 dark:hover:text-red-400 group"
      style={{ color: "var(--color-text)" }}
      title="Logout"
    >
      <LogOut size={20} className="opacity-70 group-hover:opacity-100 transition-opacity" />
    </button>
  );
}
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../auth/msalconfig";
import { useNavigate } from "react-router-dom";
import { UserLock } from "lucide-react";
import msLogo from "../components/assets/msLogo.png";

export default function SignInPage() {
  const { instance, accounts } = useMsal();
  const navigate = useNavigate();

  if (accounts.length) {
    navigate("/");
  }

  const handleLogin = () => {
    instance.loginRedirect(loginRequest);
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen overflow-hidden bg-[#0f172a]">
      <div className="absolute top-0 -left-4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-pulse"></div>
      <div className="absolute bottom-0 -right-4 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-pulse delay-700"></div>

      <div className="relative z-10 w-full max-w-md p-10 mx-4 transition-all border border-white/10 shadow-2xl bg-white/5 backdrop-blur-2xl rounded-3xl">

        <div className="flex flex-col items-center mb-10">
          <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-400 shadow-lg shadow-blue-500/20">
            <UserLock size={48} className="text-white" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">
            Career Portal
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Sign in to manage your enterprise assets
          </p>
        </div>

        <div className="space-y-6">
          <button
            onClick={handleLogin}
            className="group flex items-center justify-center gap-3 w-full px-6 py-3 
             bg-white rounded-xl shadow-sm border border-slate-200
             hover:bg-slate-50 hover:shadow-md transition-all duration-200
             active:scale-[0.98]"
          >
            <img
              src={msLogo}
              alt="Microsoft"
              className="w-6 h-6 object-contain"
            />

            <span className="font-semibold text-slate-700 group-hover:text-slate-900">
              Continue with Microsoft
            </span>
          </button>

          <div className="flex items-center justify-center space-x-2 text-xs text-slate-500">
            <span className="h-[1px] w-12 bg-slate-800"></span>
            <span>PROTECTED BY AZURE AD</span>
            <span className="h-[1px] w-12 bg-slate-800"></span>
          </div>
        </div>
      </div>
    </div>
  );
}
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: "Home", path: "/home" },
    { name: "Career", path: "/careers" },
  ];

  return (
    <nav className="w-full py-6 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white/80 backdrop-blur-md rounded-[1.5rem] border border-slate-200 shadow-xl shadow-slate-200/40 p-1.5 flex items-center justify-between">
          <Link 
            to="/" 
            className="bg-white px-8 py-3 flex items-center border border-slate-100 shadow-sm transition-transform active:scale-95"
            style={{ 
                clipPath: "polygon(0 0, 88% 0, 100% 100%, 0% 100%)",
                borderRadius: "1rem 0 0 1rem" 
            }}
          >
            <div className="flex flex-col pr-6">
              <span className="text-xl font-black text-[#004d54] tracking-tighter leading-none">
                MAVENS<span className="text-orange-500">-i</span>
              </span>
              <span className="text-[8px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">
                Technology Partner
              </span>
            </div>
          </Link>
          <div className="hidden md:flex flex-1 items-center justify-center gap-1 mx-2">
            <div className="bg-slate-50/50 border border-slate-100/50 rounded-xl flex items-center px-2 py-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`px-6 py-2 rounded-lg text-sm font-bold transition-all duration-200 ${
                      isActive 
                        ? "text-orange-600 bg-white shadow-sm" 
                        : "text-slate-500 hover:text-[#004d54]"
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
          
          <button 
            className="md:hidden p-3 text-slate-600 hover:bg-slate-50 rounded-xl transition-colors"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        {isOpen && (
          <div className="md:hidden mt-3 bg-white/90 backdrop-blur-xl rounded-[1.5rem] border border-slate-200 p-4 space-y-2 shadow-2xl animate-in fade-in slide-in-from-top-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`block w-full p-4 rounded-xl text-sm font-bold transition-colors ${
                  location.pathname === item.path 
                    ? "bg-orange-50 text-orange-600" 
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
import { Linkedin, Facebook, Instagram } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-[#002d2d] text-white py-16 px-6 md:px-20 font-sans border-t border-teal-900">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-20">
          <div className="lg:col-span-1 md:border-r border-teal-800/30 pr-8">
            <div className="flex flex-col pr-6 items-center mb-2">
              <span className="text-2xl font-black tracking-tighter">MAVENS<span className="text-orange-500">-i</span> </span>
               <span className="text-[8px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">
                Technology Partner
              </span>
            </div>
          </div>
          <div>
            <h4 className="font-bold mb-8 text-sm uppercase tracking-widest text-teal-500/50">Services</h4>
            <ul className="space-y-4 text-[13px] font-medium text-slate-300">
              {["Open Source Database Management", "DB Managed Services", "Database Support Services"].map((item) => (
                <li key={item} className="hover:text-white cursor-pointer transition-all hover:translate-x-1">{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-8 text-sm uppercase tracking-widest text-teal-500/50">Resources</h4>
            <ul className="space-y-4 text-[13px] font-medium text-slate-300">
              {["Blogs", "Webinars", "Case Studies", "Podcasts", "Meetups"].map((item) => (
                <li key={item} className="hover:text-white cursor-pointer transition-all hover:translate-x-1">{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6 text-sm uppercase tracking-widest text-teal-500/50">Industries</h4>
            <ul className="space-y-4 text-[13px] font-medium text-slate-300">
              <li className="hover:text-white cursor-pointer transition-all hover:translate-x-1">Fintech</li>
              <li className="hover:text-white cursor-pointer transition-all hover:translate-x-1">SaaS</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-8 text-sm uppercase tracking-widest text-teal-500/50">Company</h4>
            <ul className="space-y-4 text-[13px] font-medium text-slate-300 mb-12">
              <li className="hover:text-white cursor-pointer transition-all hover:translate-x-1">About Us</li>
              <Link to="/careers" className="hover:text-white cursor-pointer transition-all hover:translate-x-1">Career</Link>
            </ul>
          </div>
        </div>

        <div className="pt-10 border-t border-teal-800/30 flex flex-col lg:flex-row justify-between items-center gap-10">
          <div className="flex flex-wrap gap-3">
            {[
              { icon: <Linkedin size={18} fill="currentColor" />, active: false },
              { icon: <Facebook size={18} fill="currentColor" />, active: false },
              { icon: <Instagram size={18} />, active: true },
            ].map((social, idx) => (
              <div 
                key={idx} 
                className={`w-12 h-12 rounded-xl flex items-center justify-center cursor-pointer transition-all border border-teal-800/50 hover:border-teal-400 hover:-translate-y-1
                ${social.active 
                  ? 'bg-white text-[#002d2d] shadow-lg shadow-white/10' 
                  : 'bg-[#003d3d]/50 text-slate-300 hover:bg-[#004d4d]'}`}
              >
                {social.icon}
              </div>
            ))}
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 text-[11px] font-bold uppercase tracking-[0.15em] text-slate-500">
            <span className="hover:text-teal-400 transition-colors cursor-default">© All Rights Reserved</span>
            <div className="hidden md:block w-1.5 h-1.5 bg-teal-800 rounded-full"></div>
            <span className="hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
            <div className="hidden md:block w-1.5 h-1.5 bg-teal-800 rounded-full"></div>
            <span className="hover:text-white cursor-pointer transition-colors">Terms & Conditions</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
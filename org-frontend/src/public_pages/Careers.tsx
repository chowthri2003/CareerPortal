import { useEffect, useState } from "react";
import { axiosInstance } from "../lib/axios";
import Navbar from "../components/Layout/NavBar";
import Footer from "../components/Layout/Footer";
import { useNavigate } from "react-router-dom";
import { Briefcase, MapPin, Globe, Clock, ArrowUpRight } from "lucide-react";

interface Job {
  id: number;
  title: string;
  location: string;
  jobType: string;
  workMode: string;
  postedAt: string;
}

export default function Careers() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    axiosInstance.get("/jobs").then(res => setJobs(res.data.data));
  }, []);

  const getPostedTime = (date: string) => {
    if (!date) return "";

    const diff = Date.now() - new Date(date).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return "Posted today";
    if (days === 1) return "Posted 1 day ago";
    return `Posted ${days} days ago`;
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans selection:bg-orange-100 selection:text-orange-600">
      <Navbar />
      <div className="bg-[#004d54] border-b border-slate-200 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <span className="text-orange-500 font-black uppercase tracking-[0.3em] text-[10px]">Work With Us</span>
          <h1 className="text-4xl md:text-6xl font-black text-slate-100 tracking-tighter mt-2">
            Build the Future of <br />
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-16 px-6">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Open Opportunities</h2>
          <div className="px-4 py-1 bg-slate-100 rounded-full text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            {jobs.length} Positions Available
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1">
          {jobs.map((job) => (
            <div
              key={job.id}
              onClick={() => navigate(`/job/${job.id}`)}
              className="group relative bg-white rounded-3xl border border-slate-200 overflow-hidden flex flex-col lg:flex-row lg:items-center justify-between hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-300 cursor-pointer"
            >
              <div className="flex flex-col lg:flex-row lg:items-center gap-6 p-6">
                <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-[#004d54] border border-slate-100 group-hover:bg-[#004d54] group-hover:text-white transition-all duration-500">
                  <Briefcase size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-800 group-hover:text-[#004d54] transition-colors duration-300">
                    {job.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-y-2 gap-x-4 mt-2">
                    <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                      <MapPin size={14} className="text-orange-500" /> {job.location}
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                      <Clock size={14} className="text-orange-500" /> {job.jobType}
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                      <Globe size={14} className="text-orange-500" /> {job.workMode}
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                      <Clock size={14} className="text-orange-500" />
                      {getPostedTime(job.postedAt)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-stretch h-full self-stretch">
                <div className="flex items-center h-full">
                  <div
                    className="h-full bg-slate-50 group-hover:bg-[#004d54] text-[#004d54] group-hover:text-white flex items-center px-10 font-black text-[11px] uppercase tracking-[0.2em] transition-all duration-500 ease-in-out"
                    style={{
                      clipPath: "polygon(15% 0, 100% 0, 85% 100%, 0% 100%)",
                      marginRight: "-20px"
                    }}
                  >
                    Apply
                  </div>
                  <div
                    className="h-full bg-slate-100 group-hover:bg-orange-500 text-[#004d54] group-hover:text-white flex items-center justify-center pl-10 pr-8 transition-all duration-500 ease-in-out"
                    style={{
                      clipPath: "polygon(20% 0, 100% 0, 100% 100%, 0% 100%)"
                    }}
                  >
                    <ArrowUpRight size={24} strokeWidth={3} className="group-hover:translate-x-1 transition-transform duration-500" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {jobs.length === 0 && (
          <div className="text-center py-20 bg-white rounded-[3rem] border border-dashed border-slate-300">
            <p className="text-slate-400 font-bold italic">No active openings at the moment. Check back soon!</p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

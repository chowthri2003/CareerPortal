import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { axiosInstance } from "../lib/axios";
import { Briefcase, MapPin, Clock, ArrowLeft, Send, CheckCircle2, Target, Sparkles, Info } from "lucide-react";
import Navbar from "../components/Layout/NavBar";

export default function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance.get(`/jobs/${id}`)
      .then(res => setJob(res.data.data))
      .catch(() => navigate("/careers"))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F15A24]"></div>
          <p className="text-slate-500 font-medium animate-pulse">Loading amazing opportunities...</p>
        </div>
      </div>
    );
  }

  if (!job) return null;

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />
      <div className="bg-[#004d54] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#F15A24] opacity-5 -mr-20 -mt-20 rounded-full blur-3xl"></div>

        <div className="max-w-7xl mx-auto px-6 pt-12 pb-20 relative z-10">
          <button
            onClick={() => navigate("/careers")}
            className="flex items-center gap-2 text-slate-300 hover:text-[#F15A24] mb-8 transition-colors font-bold text-xs uppercase tracking-widest"
          >
            <ArrowLeft size={16} /> Back to Careers
          </button>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#F15A24] text-[10px] font-black uppercase tracking-[0.2em] mb-4">
              <Sparkles size={12} fill="currentColor" /> We are hiring
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-tight mb-6">
              {job.title}
            </h1>

            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-slate-200">
                <MapPin size={18} className="text-[#F15A24]" />
                <span className="text-sm font-semibold">{job.location}</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-slate-200">
                <Briefcase size={18} className="text-[#F15A24]" />
                <span className="text-sm font-semibold">{job.jobType}</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-slate-200">
                <Clock size={18} className="text-[#F15A24]" />
                <span className="text-sm font-semibold">{job.workMode}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-10 pb-20 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100">

              <div className="space-y-12">
                <section>
                  <h2 className="text-xl font-black text-[#2D3154] uppercase tracking-tight mb-6 flex items-center gap-3">

                    <div className="p-2 bg-orange-50 text-[#F15A24] rounded-lg">
                      <Info size={24} />
                    </div>

                    Role Overview
                  </h2>

                  <p className="text-slate-600 leading-relaxed text-lg whitespace-pre-line">
                    {job.roleOverview}
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-black text-[#2D3154] uppercase tracking-tight mb-6 flex items-center gap-3">
                    <div className="p-2 bg-orange-50 text-[#F15A24] rounded-lg">
                      <CheckCircle2 size={24} />
                    </div>
                    Key Requirements
                  </h2>
                  <div className="prose prose-slate max-w-none">
                    <p className="text-slate-600 leading-relaxed text-lg whitespace-pre-line">
                      {job.keyRequirements}
                    </p>
                  </div>
                </section>

                <section>
                  <h2 className="text-xl font-black text-[#2D3154] uppercase tracking-tight mb-6 flex items-center gap-3">
                    <div className="p-2 bg-green-50 text-green-600 rounded-lg">
                      <Target size={24} />
                    </div>
                    Core Responsibilities
                  </h2>
                  <p className="text-slate-600 leading-relaxed text-lg whitespace-pre-line">
                    {job.coreRequirements}
                  </p>
                </section>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 sticky top-8 overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-2 "></div>

              <h3 className="text-2xl font-black text-[#2D3154] tracking-tight mb-8">Job Summary</h3>

              <div className="space-y-6 mb-10">
                <div className="flex items-center justify-between group/item">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-slate-50 text-slate-400 group-hover/item:text-[#F15A24] transition-colors">
                      <Target size={20} />
                    </div>
                    <span className="text-slate-500 font-bold text-sm uppercase tracking-wider">Experience</span>
                  </div>
                  <span className="text-[#2D3154] font-black">{job.experienceRequired}</span>
                </div>

                <div className="flex items-center justify-between group/item border-t border-slate-50 pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-slate-50 text-slate-400 group-hover/item:text-[#F15A24] transition-colors">
                      <MapPin size={20} />
                    </div>
                    <span className="text-slate-500 font-bold text-sm uppercase tracking-wider">Location</span>
                  </div>
                  <span className="text-[#2D3154] font-black">{job.location}</span>
                </div>

                <div className="flex items-center justify-between group/item border-t border-slate-50 pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-slate-50 text-slate-400 group-hover/item:text-[#F15A24] transition-colors">
                      <CheckCircle2 size={20} />
                    </div>
                    <span className="text-slate-500 font-bold text-sm uppercase tracking-wider">Type</span>
                  </div>
                  <span className="text-[#2D3154] font-black">{job.jobType}</span>
                </div>
              </div>

              <button
                onClick={() => navigate(`/apply/${job.id}`)}
                className="w-full bg-[#F15A24] hover:bg-[#d94e1e] text-white font-black py-5 rounded-[1.25rem] flex items-center justify-center gap-3 transition-all shadow-lg shadow-orange-100 active:scale-[0.97]"
              >
                Apply for Position <Send size={18} />
              </button>

              <div className="mt-6 p-4 bg-slate-50 rounded-xl">
                <p className="text-xs text-center text-slate-500 leading-relaxed">
                  Join our team and help us build the future.
                  <br /><span className="font-bold">Application takes ~5 mins.</span>
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
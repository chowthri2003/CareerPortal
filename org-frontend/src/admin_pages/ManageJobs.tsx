import { useEffect, useState } from "react";
import { axiosInstance } from "../lib/axios";
import {Edit3, Trash2, Plus, MapPin, Clock, Globe} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function ManageJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/jobs?adminView=true");
      setJobs(res.data.data);
    } catch (error) {
      toast.error("Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchJobs(); }, []);

  const handleStatusChange = async (id: number, status: string) => {
    const promise = axiosInstance.patch(`/jobs/${id}/status`, { status });
    toast.promise(promise, {
      loading: 'Updating status...',
      success: () => {
        fetchJobs();
        return `Role is now ${status}`;
      },
      error: 'Failed to update status',
    });
  };

  const handleDelete = async (id: number) => {
    toast("Delete Posting?", {
      description: "This will permanently remove the job and all associated data.",
      action: {
        label: "Delete",
        onClick: async () => {
          try {
            await axiosInstance.delete(`/jobs/${id}`);
            toast.success("Job deleted");
            fetchJobs();
          } catch (e) { toast.error("Delete failed"); }
        },
      },
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight" style={{ color: "var(--color-text)" }}>
            Active Job Postings
          </h1>
          <p className="text-sm font-medium opacity-60" style={{ color: "var(--color-text)" }}>
            Manage and monitor your organization's recruitment pipeline.
          </p>
        </div>
        <button
          onClick={() => navigate("/jobs/create")}
          className="px-5 py-2.5 rounded-xl flex items-center gap-2 font-bold text-sm transition-all shadow-lg active:scale-95 text-white"
          style={{ backgroundColor: "var(--color-accent)" }}
        >
          <Plus size={18} /> Post New Role
        </button>
      </div>

      <div 
        className="border rounded-2xl overflow-hidden shadow-sm transition-all duration-500"
        style={{ 
          backgroundColor: "var(--color-primary)", 
          borderColor: "var(--color-primaryBorder)" 
        }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr 
                className="border-b transition-colors" 
                style={{ 
                  backgroundColor: "var(--color-primaryLight)", 
                  borderColor: "var(--color-primaryBorder)" 
                }}
              >
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest opacity-50" style={{ color: "var(--color-text)" }}>Job Details</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest opacity-50" style={{ color: "var(--color-text)" }}>Environment</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest opacity-50" style={{ color: "var(--color-text)" }}>Status</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-right opacity-50" style={{ color: "var(--color-text)" }}>Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: "var(--color-primaryBorder)" }}>
              {loading ? (
                [1, 2, 3].map((i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={5} className="p-20 text-center">
                      <div className="h-4 rounded w-1/2 opacity-20" style={{ backgroundColor: "var(--color-text)" }}></div>
                    </td>
                  </tr>
                ))
              ) : jobs.length > 0 ? (
                jobs.map((job: any) => (
                  <tr 
                    key={job.id} 
                    className="transition-colors group"
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--color-primaryLight)")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                  >
                    <td className="px-6 py-8">
                      <div>
                        <p 
                          className="font-bold leading-none mb-1 transition-colors" 
                          style={{ color: "var(--color-text)" }}
                        >
                          {job.title}
                        </p>
                        <div className="flex items-center gap-3 text-[11px] font-medium opacity-50" style={{ color: "var(--color-text)" }}>
                          <span className="flex items-center gap-1"><MapPin size={12} /> {job.location}</span>
                          <span className="flex items-center gap-1"><Clock size={12} /> {job.jobType}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div 
                        className="flex items-center gap-2 text-xs font-bold w-fit px-2.5 py-1 rounded-lg border transition-colors"
                        style={{ 
                          backgroundColor: "var(--color-secondary)", 
                          color: "var(--color-text)",
                          borderColor: "var(--color-primaryBorder)"
                        }}
                      >
                        <Globe size={12} className="opacity-50" />
                        {job.workMode}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={job.status}
                        onChange={(e) => handleStatusChange(job.id, e.target.value)}
                        className={`text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-lg border-none ring-1 ring-inset outline-none cursor-pointer transition-all ${
                          job.status === "Posted" 
                            ? "bg-emerald-500/10 text-emerald-500 ring-emerald-500/20" 
                            : job.status === "Position Filled" 
                            ? "bg-rose-500/10 text-rose-500 ring-rose-500/20" 
                            : "opacity-60 ring-inset"
                        }`}
                        style={job.status === "Draft" ? { 
                          backgroundColor: "var(--color-secondary)", 
                          color: "var(--color-text)",
                          boxShadow: "inset 0 0 0 1px var(--color-primaryBorder)"
                        } : {}}
                      >
{["Draft", "Posted", "Position Filled"].map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end items-center gap-1">
                        <button
                          onClick={() => navigate(`/jobs/edit/${job.id}`)}
                          className="p-2 rounded-lg transition-all hover:bg-opacity-20"
                          style={{ color: "var(--color-text)" }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.color = "var(--color-accent)";
                            e.currentTarget.style.backgroundColor = "var(--color-primaryLight)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.color = "var(--color-text)";
                            e.currentTarget.style.backgroundColor = "transparent";
                          }}
                          title="Edit"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(job.id)}
                          className="p-2 rounded-lg transition-all hover:bg-rose-500/10 hover:text-rose-500"
                          style={{ color: "var(--color-text)" }}
                          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-text)")}
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <p className="font-medium italic opacity-40" style={{ color: "var(--color-text)" }}>
                      No jobs found. Click "Post New Role" to get started.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
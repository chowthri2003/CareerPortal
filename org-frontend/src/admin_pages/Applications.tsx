import { useEffect, useState, useMemo } from "react";
import { axiosInstance } from "../lib/axios";
import { Eye, Download, Search, Filter, User, Briefcase, ChevronDown, Loader2 } from "lucide-react";
import { toast } from "sonner";
import ApplicantDetailModal from "./ApplicationDetailModel";
import { useTheme } from "../components/hooks/useTheme";

export default function Applications() {
  useTheme();
  const [apps, setApps] = useState([]);
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  const loadApps = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/applications");
      setApps(res.data.data);
    } catch (err) {
      toast.error("Failed to load applications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadApps(); }, []);

  const filteredApps = useMemo(() => {
    return apps.filter((app: any) => {
      const fullName = `${app.firstName} ${app.lastName}`.toLowerCase();
      const matchesSearch =
        fullName.includes(searchTerm.toLowerCase()) ||
        app.email.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === "All" || app.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [apps, searchTerm, statusFilter]);

  const updateStatus = async (id: number, status: string) => {
    try {
      await axiosInstance.patch(`/applications/${id}/status`, { status });
      toast.success(`Applicant moved to ${status}`);
      loadApps();
    } catch {
      toast.error("Failed to update status");
    }
  };

  const downloadResume = async (id: number) => {
    try {
      const res = await axiosInstance.get(
        `/applications/${id}/resume/download`,
        { responseType: "blob" }
      );

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `resume_${id}.pdf`);
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

    } catch (err) {
      console.error("Download failed:", err);
      toast.error("Download failed");
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight" style={{ color: "var(--color-text)" }}>
            Application Management
          </h1>
          <p className="font-medium mt-1 opacity-60" style={{ color: "var(--color-text)" }}>
            Review and manage candidate applications across all roles
          </p>
        </div>
        <div 
          className="px-5 py-2.5 rounded-2xl text-[11px] font-black uppercase tracking-[0.1em] border shadow-sm transition-colors"
          style={{ 
            backgroundColor: "var(--color-primaryLight)", 
            color: "var(--color-accent)",
            borderColor: "var(--color-primaryBorder)"
          }}
        >
          {filteredApps.length} Results Found
        </div>
      </div>
      <div 
        className="flex flex-col lg:flex-row items-center gap-4 p-4 rounded-[2rem] border shadow-xl transition-all duration-500"
        style={{ 
          backgroundColor: "var(--color-primary)", 
          borderColor: "var(--color-primaryBorder)",
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.05)" 
        }}
      >
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30" style={{ color: "var(--color-text)" }} size={20} />
          <input
            type="text"
            placeholder="Search candidates by name or email..."
            className="w-full pl-12 pr-4 py-3 border rounded-2xl outline-none transition-all text-sm font-medium"
            style={{ 
              backgroundColor: "var(--color-primaryLight)", 
              borderColor: "var(--color-primaryBorder)",
              color: "var(--color-text)"
            }}
            onFocus={(e) => e.currentTarget.style.borderColor = "var(--color-accent)"}
            onBlur={(e) => e.currentTarget.style.borderColor = "var(--color-primaryBorder)"}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-3 w-full lg:w-auto">
          <div className="relative w-full lg:w-48">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30" style={{ color: "var(--color-text)" }} size={16} />
            <select
              className="w-full pl-10 pr-10 py-3 text-sm font-bold rounded-2xl outline-none appearance-none transition-all border cursor-pointer"
              style={{ 
                backgroundColor: "var(--color-primaryLight)", 
                borderColor: "var(--color-primaryBorder)",
                color: "var(--color-text)"
              }}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Statuses</option>
              {["New", "Screened", "Interviewing", "Offered", "Rejected"].map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 opacity-30 pointer-events-none" style={{ color: "var(--color-text)" }} size={16} />
          </div>
        </div>
      </div>

      <div 
        className="rounded-2xl border shadow-2xl overflow-hidden transition-all duration-500"
        style={{ 
          backgroundColor: "var(--color-primary)", 
          borderColor: "var(--color-primaryBorder)",
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
                <th className="p-6 py-4 text-[10px] font-black uppercase tracking-[0.15em] opacity-50" style={{ color: "var(--color-text)" }}>Candidate</th>
                <th className="p-6 py-4 text-[10px] font-black uppercase tracking-[0.15em] opacity-50 text-center" style={{ color: "var(--color-text)" }}>Applied For</th>
                <th className="p-6 py-4 text-[10px] font-black uppercase tracking-[0.15em] opacity-50 text-center" style={{ color: "var(--color-text)" }}>Experience</th>
                <th className="p-6 py-4 text-[10px] font-black uppercase tracking-[0.15em] opacity-50 text-center" style={{ color: "var(--color-text)" }}>Stage</th>
                <th className="p-6 py-4 text-[10px] font-black uppercase tracking-[0.15em] opacity-50 text-right" style={{ color: "var(--color-text)" }}>Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: "var(--color-primaryBorder)" }}>
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <Loader2 className="animate-spin" style={{ color: "var(--color-accent)" }} size={48} />
                      <p className="font-medium animate-pulse opacity-50" style={{ color: "var(--color-text)" }}>Loading applications...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredApps.length > 0 ? (
                filteredApps.map((app: any) => (
                  <tr 
                    key={app.id} 
                    className="transition-colors group"
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--color-primaryLight)")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                  >
                    <td className="p-6">
                      <div className="flex items-center gap-4">
                        <div 
                          className="w-11 h-11 rounded-2xl flex items-center justify-center font-bold border shadow-sm group-hover:scale-110 transition-transform"
                          style={{ 
                            backgroundColor: "var(--color-secondary)", 
                            color: "var(--color-accent)",
                            borderColor: "var(--color-primaryBorder)"
                          }}
                        >
                          {app.firstName[0]}{app.lastName[0]}
                        </div>
                        <div>
                          <p className="font-bold leading-none mb-1.5" style={{ color: "var(--color-text)" }}>{app.firstName} {app.lastName}</p>
                          <p className="text-xs font-medium opacity-50" style={{ color: "var(--color-text)" }}>{app.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-6 text-center">
                      <div 
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-lg border"
                        style={{ 
                          backgroundColor: "var(--color-secondary)", 
                          color: "var(--color-text)",
                          borderColor: "var(--color-primaryBorder)"
                        }}
                      >
                        <Briefcase size={12} className="opacity-50" />
                        <span className="text-xs font-bold">{app.job?.title || "N/A"}</span>
                      </div>
                    </td>
                    <td className="p-6 text-center text-sm font-bold opacity-70" style={{ color: "var(--color-text)" }}>
                      {app.totalExperience} Years
                    </td>
                    <td className="p-6 text-center">
                      <select
                        value={app.status}
                        onChange={(e) => updateStatus(app.id, e.target.value)}
                        className={`text-[10px] font-black px-4 py-2 rounded-xl ring-1 ring-inset outline-none transition-all appearance-none text-center uppercase tracking-tighter cursor-pointer ${getStatusColor(app.status)}`}
                      >
                        {["New", "Screened", "Interviewing", "Offered", "Rejected"].map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                    <td className="p-6 text-right">
                      <div className="flex justify-end items-center gap-2">
                        <button
                          onClick={() => setSelectedApp(app)}
                          className="flex items-center gap-2 px-4 py-2 rounded-xl transition-all font-bold text-xs"
                          style={{ color: "var(--color-accent)" }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "var(--color-primaryLight)"}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                        >
                          <Eye size={16} /> View
                        </button>
                        <button
                          onClick={() => downloadResume(app.id)}
                          className="p-2 rounded-xl transition-all opacity-50 hover:opacity-100"
                          style={{ color: "var(--color-text)" }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "var(--color-secondary)"}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                          title="Download Resume"
                        >
                          <Download size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-20 text-center">
                    <div className="flex flex-col items-center gap-3 opacity-20" style={{ color: "var(--color-text)" }}>
                      <User size={48} />
                      <p className="font-medium italic">No applications found.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedApp && (
        <ApplicantDetailModal
          app={selectedApp}
          onClose={() => setSelectedApp(null)}
        />
      )}
    </div>
  );
}

function getStatusColor(status: string) {
  switch (status) {
    case "New":
      return "bg-sky-500/10 text-sky-500 ring-sky-500/20 hover:bg-sky-500/20";
    case "Screened":
      return "bg-blue-500/10 text-blue-500 ring-blue-500/20 hover:bg-blue-500/20";
    case "Interviewing":
      return "bg-purple-500/10 text-purple-500 ring-purple-500/20 hover:bg-purple-500/20";
    case "Offered":
      return "bg-emerald-500/10 text-emerald-500 ring-emerald-200/20 hover:bg-emerald-500/20";
    case "Rejected":
      return "bg-rose-500/10 text-rose-500 ring-rose-500/20 hover:bg-rose-500/20";
    default:
      return "bg-gray-500/10 text-gray-500 ring-gray-500/20";
  }
}
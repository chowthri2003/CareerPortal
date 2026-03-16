import { useEffect, useState } from "react";
import { axiosInstance } from "../lib/axios";
import { Briefcase, Users, UserPlus, CheckCircle, FileText, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuthStore } from "../store/authStore";
import { useMsal } from "@azure/msal-react";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { accounts } = useMsal();
  const [exporting, setExporting] = useState(false);
  const [stats, setStats] = useState({
    totalJobs: 0,
    totalApps: 0,
    newApps: 0,
    publishedJobs: 0,
    recentApplicants: []
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [jobsRes, appsRes] = await Promise.all([
          axiosInstance.get("/jobs?adminView=true"),
          axiosInstance.get("/applications")
        ]);

        const jobs = jobsRes.data.data;
        const apps = appsRes.data.data;

        setStats({
          totalJobs: jobs.length,
          publishedJobs: jobs.filter((j: any) => j.status === "Published").length,
          totalApps: apps.length,
          newApps: apps.filter((a: any) => a.status === "New").length,
          recentApplicants: apps.slice(0, 5)
        });
      } catch (err) {
        console.error("Dashboard load failed", err);
      }
    };
    fetchDashboardData();
  }, []);

  const handleExportReports = async () => {
    try {
      setExporting(true);
      toast.loading("Preparing report...", { id: "export" });

      const response = await axiosInstance.get(
        "/export/applications",
        { responseType: "blob" }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.download = "applications-report.xlsx";
      link.click();

      toast.success("Report exported successfully!", { id: "export" });
    } catch (error) {
      toast.error("Export failed", { id: "export" });
    } finally {
      setExporting(false);
    }
  };

  const statCards = [
    {
      label: "Live Roles",
      value: stats.publishedJobs,
      icon: <Briefcase size={22} />,
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-500/10",
      roles: ["admin", "hr"],
    },
    {
      label: "Total Talent",
      value: stats.totalApps,
      icon: <Users size={22} />,
      color: "text-green-600 dark:text-green-400",
      bg: "bg-green-500/10",
      roles: ["hr"],
    },
    {
      label: "New Leads",
      value: stats.newApps,
      icon: <Zap size={22} />,
      color: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-500/10",
      roles: ["hr"],
    },
    {
      label: "Total Openings",
      value: stats.totalJobs,
      icon: <CheckCircle size={22} />,
      color: "text-violet-600 dark:text-violet-400",
      bg: "bg-violet-500/10",
      roles: ["admin", "hr"],
    },
  ];

  return (
    <div className="space-y-8 transition-colors duration-500">
      <div>
        <h1 className="text-3xl font-black tracking-tight" style={{ color: "var(--color-text)" }}>
          Dashboard
        </h1>
        <p className="text-slate-500 dark:text-slate-400 font-medium">
          Hello <span className="capitalize">{user?.role || "..."}</span> {accounts[0]?.name?.split(" ")[0] || accounts[0]?.username?.split("@")[0] || ""}, welcome to your overview.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards
          .filter(card => !user || card.roles.includes(user.role))
          .map((card, i) => (
          <div 
            key={i} 
            className="p-6 rounded-3xl shadow-sm border border-slate-200/60 dark:border-slate-800 transition-all duration-300"
            style={{ backgroundColor: "var(--color-primary)" }}
          >
            <div className="flex items-center gap-5">
              <div className={`p-4 rounded-2xl ${card.bg} ${card.color}`}>
                {card.icon}
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none mb-1">
                  {card.label}
                </p>
                <p className="text-2xl font-black transition-colors" style={{ color: "var(--color-text)" }}>
                  {card.value}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {(user?.role === "hr" || !user) && (
          <div 
            className="lg:col-span-8 p-8 rounded-[2rem] border border-slate-200/60 dark:border-slate-800 shadow-sm transition-all duration-300"
            style={{ backgroundColor: "var(--color-primary)" }}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold" style={{ color: "var(--color-text)" }}>Recent Applicants</h3>
              <button 
                onClick={() => navigate('/applications')} 
                className="text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                View All
              </button>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800/50">
              {stats.recentApplicants.length > 0 ? (
                stats.recentApplicants
                  .slice()
                  .reverse()
                  .map((app: any) => (
                    <div key={app.id} className="flex items-center justify-between py-4 group">
                      <div className="flex items-center gap-4">
                        <div 
                          className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-slate-500 dark:text-slate-400 text-sm transition-colors"
                          style={{ backgroundColor: "var(--color-secondary)" }}
                        >
                          {app.firstName[0]}
                        </div>
                        <div>
                          <p className="font-bold text-sm" style={{ color: "var(--color-text)" }}>
                            {app.firstName} {app.lastName}
                          </p>
                          <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                            {app.job?.title}
                          </p>
                        </div>
                      </div>
                      <span 
                        className="text-[10px] font-bold px-2.5 py-1 rounded-lg text-slate-500 dark:text-slate-400 uppercase tracking-wider"
                        style={{ backgroundColor: "var(--color-secondary)" }}
                      >
                        {app.status}
                      </span>
                    </div>
                  ))
              ) : (
                <p className="text-center py-10 text-slate-400 dark:text-slate-600 text-sm italic">
                  No recent activity.
                </p>
              )}
            </div>
          </div>
        )}

        <div className={(user?.role === "hr" || !user) ? "lg:col-span-4 space-y-4" : "lg:col-span-12 space-y-4"}>
          <h3 className="text-sm font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest pl-2">
            Quick Actions
          </h3>
          <div className={`grid gap-3 ${user?.role === "admin" ? "grid-cols-1 sm:grid-cols-3" : "grid-cols-1"}`}>
            <button
              onClick={() => navigate('/jobs/create')}
              className="flex items-center gap-4 p-4 border border-slate-200/60 dark:border-slate-800 rounded-2xl hover:border-indigo-500 dark:hover:border-indigo-400 transition-all font-bold text-sm group"
              style={{ backgroundColor: "var(--color-primary)", color: "var(--color-text)" }}
            >
              <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-lg transition-colors">
                <UserPlus size={18} />
              </div>
              Post New Role
            </button>

            <button
              onClick={() => navigate('/jobs')}
              className="flex items-center gap-4 p-4 border border-slate-200/60 dark:border-slate-800 rounded-2xl hover:border-indigo-500 dark:hover:border-indigo-400 transition-all font-bold text-sm group"
              style={{ backgroundColor: "var(--color-primary)", color: "var(--color-text)" }}
            >
              <div 
                className="p-2 rounded-lg transition-colors"
                style={{ backgroundColor: "var(--color-secondary)" }}
              >
                <Briefcase size={18} className="text-slate-600 dark:text-slate-400" />
              </div>
              Manage Jobs
            </button>

            {(user?.role === "hr" || !user) && (
              <button
                onClick={handleExportReports}
                disabled={exporting}
                className="flex items-center gap-4 p-4 border border-slate-200/60 dark:border-slate-800 rounded-2xl hover:border-indigo-500 dark:hover:border-indigo-400 transition-all font-bold text-sm group disabled:opacity-50"
                style={{ backgroundColor: "var(--color-primary)", color: "var(--color-text)" }}
              >
                <div 
                  className="p-2 rounded-lg transition-colors"
                  style={{ backgroundColor: "var(--color-secondary)" }}
                >
                  <FileText size={18} className="text-slate-600 dark:text-slate-400" />
                </div>
                {exporting ? "Exporting..." : "Export Reports"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
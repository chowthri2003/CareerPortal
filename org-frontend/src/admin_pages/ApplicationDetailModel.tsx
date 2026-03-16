import { X, Mail, Phone, Calendar, MapPin, FileText } from "lucide-react";
import { axiosInstance } from "../lib/axios";
import { toast } from "sonner";
import { useState } from "react";
import ResumeViewer from "../components/filePreview";

interface Props {
  app: any;
  onClose: () => void;
}

export default function ApplicantDetailModal({ app, onClose }: Props) {
  const [resumeBlob, setResumeBlob] = useState<Blob | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);

  const downloadResume = async () => {
    try {
      const res = await axiosInstance.get(
        `/applications/${app.id}/resume/download`,
        { responseType: "blob" }
      );

      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `resume_${app.id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download failed:", err);
      toast.error("Download failed");
    }
  };

  const previewResume = async () => {
    if (previewLoading) return;
    setPreviewLoading(true);
    try {
      const res = await axiosInstance.get(
        `/applications/${app.id}/resume/preview`,
        { responseType: "blob" }
      );

      const blob = new Blob([res.data], { type: "application/pdf" });
      setResumeBlob(blob);
      setShowPreview(true);
    } catch (err) {
      console.error("Preview failed:", err);
      toast.error("Could not load resume");
    } finally {
      setPreviewLoading(false);
    }
  };

  if (!app) return null;

  const sectionLabel =
    "text-[10px] font-bold uppercase tracking-[0.15em] mb-4 flex items-center gap-2 opacity-50";

  return (
    <div
      className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-[100] p-6 animate-in fade-in duration-200"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div
        className="w-full max-w-5xl max-h-[90vh] overflow-hidden rounded-2xl shadow-2xl flex flex-col border animate-in zoom-in-95 duration-200"
        style={{
          backgroundColor: "var(--color-primary)",
          borderColor: "var(--color-primaryBorder)",
        }}
      >
        <div className="p-8 border-b" style={{ borderColor: "var(--color-primaryBorder)" }}>
          <div className="flex justify-between items-start">
            <div className="flex gap-6 items-center">
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center text-xl font-bold shrink-0"
                style={{
                  backgroundColor: "var(--color-secondary)",
                  color: "var(--color-accent)",
                }}
              >
                {app.firstName[0]}
                {app.lastName[0]}
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-4">
                  <h2
                    className="text-2xl font-bold tracking-tight"
                    style={{ color: "var(--color-text)" }}
                  >
                    {app.firstName} {app.middleName || ""} {app.lastName}
                  </h2>
                  <button
                    onClick={previewResume}
                    disabled={previewLoading}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-lg font-bold text-[10px] uppercase tracking-wider transition-all active:scale-95 border disabled:opacity-50"
                    style={{
                      backgroundColor: "var(--color-primaryLight)",
                      color: "var(--color-accent)",
                      borderColor: "var(--color-accent)",
                    }}
                  >
                    <FileText size={12} />
                    {previewLoading ? "Loading…" : "Resume"}
                  </button>

                  <span
                    className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-tighter ${
                      app.gender === "Male"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-pink-100 text-pink-700"
                    }`}
                  >
                    {app.gender}
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <p
                    className="text-sm font-semibold opacity-80"
                    style={{ color: "var(--color-accent)" }}
                  >
                    {app.job?.title || "Applicant"}
                  </p>
                  <span
                    className="text-[11px] opacity-40 font-medium"
                    style={{ color: "var(--color-text)" }}
                  >
                    Applied {new Date(app.createdAt || Date.now()).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors"
              style={{ color: "var(--color-text)" }}
            >
              <X size={20} />
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-8 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">

            <div className="md:col-span-4 space-y-8">
              <div
                className="p-5 rounded-xl border"
                style={{
                  borderColor: "var(--color-primaryBorder)",
                  backgroundColor: "var(--color-primaryLight)",
                }}
              >
                <h3 className={sectionLabel} style={{ color: "var(--color-text)" }}>
                  Contact
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <Mail size={14} className="opacity-40" style={{ color: "var(--color-text)" }} />
                    <span className="truncate" style={{ color: "var(--color-text)" }}>
                      {app.email}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Phone size={14} className="opacity-40" style={{ color: "var(--color-text)" }} />
                    <span style={{ color: "var(--color-text)" }}>{app.mobilePhone}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Calendar
                      size={14}
                      className="opacity-40"
                      style={{ color: "var(--color-text)" }}
                    />
                    <span style={{ color: "var(--color-text)" }}>{app.dateOfBirth}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div
                  className="p-4 rounded-xl border text-center"
                  style={{ borderColor: "var(--color-primaryBorder)" }}
                >
                  <p
                    className="text-[10px] font-bold opacity-40 uppercase"
                    style={{ color: "var(--color-text)" }}
                  >
                    Experience
                  </p>
                  <p className="text-base font-bold" style={{ color: "var(--color-text)" }}>
                    {app.totalExperience} Yrs
                  </p>
                </div>
                <div
                  className="p-4 rounded-xl border text-center"
                  style={{ borderColor: "var(--color-primaryBorder)" }}
                >
                  <p
                    className="text-[10px] font-bold opacity-40 uppercase"
                    style={{ color: "var(--color-text)" }}
                  >
                    Notice
                  </p>
                  <p className="text-base font-bold text-orange-500">{app.noticePeriod}d</p>
                </div>
              </div>
            </div>

            <div className="md:col-span-8 space-y-4">
              <h3 className={sectionLabel} style={{ color: "var(--color-text)" }}>
                Expertise & Skills
              </h3>
              <div
                className="flex flex-wrap gap-2 p-6 rounded-xl border border-dashed"
                style={{ borderColor: "var(--color-primaryBorder)" }}
              >
                {app.skills?.split(",").map((skill: string, idx: number) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold transition-colors hover:border-accent"
                    style={{
                      backgroundColor: "var(--color-secondary)",
                      color: "var(--color-text)",
                      border: "1px solid var(--color-primaryBorder)",
                    }}
                  >
                    {skill.trim()}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <hr style={{ borderColor: "var(--color-primaryBorder)" }} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-6">
              <h3
                className="text-sm font-bold uppercase tracking-widest opacity-40 flex items-center gap-2"
                style={{ color: "var(--color-text)" }}
              >
                Experience History
              </h3>
              <div className="space-y-8 relative">
                {app.experienceDetails?.map((exp: any, i: number) => (
                  <div
                    key={i}
                    className="p-5 rounded-xl border transition-all hover:shadow-md"
                    style={{
                      backgroundColor: "var(--color-primary)",
                      borderColor: "var(--color-primaryBorder)",
                    }}
                  >
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-sm" style={{ color: "var(--color-text)" }}>
                        {exp.jobTitle}
                      </h4>
                      {exp.currentlyWorking && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-600 border border-emerald-100 uppercase">
                          Current
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-bold mt-0.5" style={{ color: "var(--color-accent)" }}>
                      {exp.companyName}
                    </p>
                    <p className="text-[10px] opacity-40 font-medium mt-1">
                      {exp.dateOfJoining} — {exp.currentlyWorking ? "Present" : exp.dateOfRelieving}
                    </p>
                    <p
                      className="text-xs mt-3 leading-relaxed opacity-60 italic"
                      style={{ color: "var(--color-text)" }}
                    >
                      {exp.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <h3
                className="text-sm font-bold uppercase tracking-widest opacity-40 flex items-center gap-2"
                style={{ color: "var(--color-text)" }}
              >
                Academic Background
              </h3>
              <div className="space-y-4">
                {app.educationDetails?.map((edu: any, i: number) => (
                  <div
                    key={i}
                    className="p-5 rounded-xl border transition-all hover:shadow-md"
                    style={{
                      backgroundColor: "var(--color-primary)",
                      borderColor: "var(--color-primaryBorder)",
                    }}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-sm" style={{ color: "var(--color-text)" }}>
                          {edu.course}
                        </h4>
                        <p className="text-xs font-bold" style={{ color: "var(--color-accent)" }}>
                          {edu.branch}
                        </p>
                      </div>
                      <span
                        className="text-[10px] font-bold opacity-40"
                        style={{ color: "var(--color-text)" }}
                      >
                        {new Date(edu.endOfCourse).getFullYear()}
                      </span>
                    </div>
                    <div
                      className="mt-4 flex items-center gap-2 opacity-50 text-[11px]"
                      style={{ color: "var(--color-text)" }}
                    >
                      <MapPin size={12} />
                      <span className="font-medium">{edu.university}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showPreview && resumeBlob && (
        <ResumeViewer
          fileData={resumeBlob}
          onClose={() => setShowPreview(false)}
          onDownload={downloadResume}
        />
      )}
    </div>
  );
}
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { axiosInstance } from "../lib/axios";
import { useNavigate, useParams } from "react-router-dom";
import { createJobSchema, type CreateJobInput } from "../../../org-backend/src/modules/job/job.schema"
import { toast } from "sonner";
import { FolderIcon, MapPin, Globe, Clock } from "lucide-react";
import { useTheme } from "../components/hooks/useTheme";

export default function CreateJob() {
  useTheme();
  const navigate = useNavigate();
  const { id } = useParams();

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<CreateJobInput>({
    resolver: zodResolver(createJobSchema),
    defaultValues: {
      workMode: "On-site",
      jobType: "Full-time"
    }
  });

  useEffect(() => {
    if (id) {
      axiosInstance.get(`/jobs/${id}`).then(res => {
        reset(res.data.data);
      });
    }
  }, [id, reset]);

  const onSubmit = async (data: CreateJobInput) => {
    try {
      const isEdit = !!id;
      const promise = isEdit
        ? axiosInstance.put(`/jobs/${id}`, data)
        : axiosInstance.post("/jobs", data);

      toast.promise(promise, {
        loading: isEdit ? 'Updating job...' : 'Posting job...',
        success: () => {
          navigate("/jobs");
          return isEdit ? 'Job updated successfully' : 'Job Posted successfully';
        },
        error: 'Something went wrong. Please check your fields.',
      });
    } catch (error) { console.error(error); }
  };

  const inputClass = `w-full border p-4 rounded-2xl outline-none transition-all text-sm font-medium focus:ring-4 hover:bg-opacity-100 transition-all duration-300`;
  const themedInputStyle = {
    backgroundColor: "var(--color-primaryLight)",
    borderColor: "var(--color-primaryBorder)",
    color: "var(--color-text)",
  };

  const labelClass = "text-[10px] font-black uppercase tracking-[0.15em] ml-2 flex items-center gap-2 opacity-60";

  return (
    <div className="max-w-6xl mx-auto pb-20 transition-colors duration-500">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl font-black tracking-tight" style={{ color: "var(--color-text)" }}>
            {id ? "Modify Posting" : "Post New Role"}
          </h1>
          <p className="font-medium opacity-70" style={{ color: "var(--color-text)" }}>
            Define the requirements and mission for this opening
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6">
          <div
            className="p-8 md:p-10 rounded-[2.5rem] border shadow-xl space-y-8 transition-all duration-500"
            style={{
              backgroundColor: "var(--color-primary)",
              borderColor: "var(--color-primaryBorder)",
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.05)"
            }}
          >
            <div className="flex items-center gap-3 border-b pb-6" style={{ borderColor: "var(--color-primaryBorder)" }}>
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: "var(--color-primaryLight)", color: "var(--color-accent)" }}
              >
                <FolderIcon size={20} />
              </div>
              <h2 className="text-xl font-bold tracking-tight" style={{ color: "var(--color-text)" }}>
                Role Context
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className={labelClass} style={{ color: "var(--color-text)" }}><Globe size={12} /> Job Title</label>
                <input {...register("title")} className={inputClass} style={themedInputStyle} placeholder="Head of Engineering" />
                {errors.title && <p className="text-rose-500 text-[10px] mt-1 font-bold uppercase ml-2">{errors.title.message}</p>}
              </div>
              <div className="space-y-2">
                <label className={labelClass} style={{ color: "var(--color-text)" }}><MapPin size={12} /> Location</label>
                <input {...register("location")} className={inputClass} style={themedInputStyle} placeholder="Pondicherry" />
              </div>
            </div>

            <div className="space-y-2">
              <label className={labelClass} style={{ color: "var(--color-text)" }}>Mission & Overview</label>
              <textarea {...register("roleOverview")} rows={4} className={inputClass} style={themedInputStyle} placeholder="What will this person achieve in their first 90 days?" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className={labelClass} style={{ color: "var(--color-text)" }}>Key Requirements</label>
                <textarea {...register("keyRequirements")} rows={6} className={inputClass + " font-mono text-xs"} style={themedInputStyle} placeholder="• 5+ Years Exp&#10;• AWS Certified..." />
              </div>
              <div className="space-y-2">
                <label className={labelClass} style={{ color: "var(--color-text)" }}>Main Responsibilities</label>
                <textarea {...register("coreRequirements")} rows={6} className={inputClass + " font-mono text-xs"} style={themedInputStyle} placeholder="• Lead weekly sprints&#10;• Mentor junior devs..." />
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4">
          <div
            className="p-8 rounded-[2.5rem] border shadow-xl space-y-8 sticky top-6 transition-all duration-500"
            style={{
              backgroundColor: "var(--color-primary)",
              borderColor: "var(--color-primaryBorder)"
            }}
          >
            <h2 className="text-xs font-black uppercase tracking-[0.2em] border-b pb-4" style={{ color: "var(--color-text)", opacity: 0.5, borderColor: "var(--color-primaryBorder)" }}>
              Job Summary
            </h2>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className={labelClass} style={{ color: "var(--color-text)" }}><Clock size={12} /> Experience level</label>
                <input {...register("experienceRequired")} className={inputClass} style={themedInputStyle} placeholder="e.g. Senior (7+ Years)" />
              </div>

              <div className="space-y-2">
                <label className={labelClass} style={{ color: "var(--color-text)" }}>Environment</label>
                <select {...register("workMode")} className={inputClass + " appearance-none font-bold"} style={themedInputStyle}>
                  {["On-site", "Hybrid", "Remote"].map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className={labelClass} style={{ color: "var(--color-text)" }}>Contract Type</label>
                <select {...register("jobType")} className={inputClass + " appearance-none font-bold"} style={themedInputStyle}>
                  {["Full-time", "Contract", "Internship"].map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="pt-6 border-t space-y-4" style={{ borderColor: "var(--color-primaryBorder)" }}>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full text-white py-4 rounded-2xl font-black text-sm transition-all active:scale-95 disabled:opacity-50 shadow-lg"
                style={{
                  background: `linear-gradient(to right, var(--color-accent), var(--color-primaryDark))`,
                }}
              >
                {isSubmitting ? "Syncing..." : id ? "Commit Changes" : "Push to Portal"}
              </button>
              <button
                type="button"
                onClick={() => navigate("/jobs")}
                className="w-full py-4 rounded-2xl font-bold text-sm transition-all hover:brightness-95"
                style={{
                  backgroundColor: "var(--color-primaryLight)",
                  color: "var(--color-text)",
                  opacity: 0.8
                }}
              >
                Discard
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
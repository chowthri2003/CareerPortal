import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useNavigate } from "react-router-dom";
import { axiosInstance } from "../lib/axios";
import { Trash2, ChevronRight, ChevronLeft, UploadCloud, ArrowLeft, User, Briefcase, GraduationCap, FileText, Check } from "lucide-react";
import Navbar from "../components/Layout/NavBar";
import { toast } from "sonner";
import { z } from "zod";


const experienceItemSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  jobTitle: z.string().min(1, "Job title is required"),
  currentlyWorking: z.boolean(),
  dateOfJoining: z.string().min(1, "Date of joining is required"),
  dateOfRelieving: z.string().optional().nullable(),
  description: z.string(),
}).refine(
  (data) => {
    if (!data.currentlyWorking && !data.dateOfRelieving) {
      return false;
    }
    return true;
  },
  {
    message: "Date of relieving required if not currently working",
    path: ["dateOfRelieving"],
  }
);

const educationItemSchema = z.object({
  course: z.string().min(1, "Course is required"),
  branch: z.string().min(1, "Branch is required"),
  startOfCourse: z.string().min(1, "Start date is required"),
  endOfCourse: z.string().min(1, "End date is required"),
  university: z.string().min(1, "University is required"),
});
const applyJobSchema = z.object({
  jobId: z.number(),
  firstName: z.string().min(1, "First name is required"),
  middleName: z.string().optional(),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  mobilePhone: z.string().min(10, "Valid phone number required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  totalExperience: z.string().min(1, "Total experience is required"),
  currentSalary: z.string().min(1, "Current salary is required"),
  noticePeriod: z.string("Notice period is required"),
  skills: z.string().min(1, "Skills are required"),
  gender: z.string().min(1, "Gender is required"),
  resumeUrl: z.string().optional(),
  experienceDetails: z.array(experienceItemSchema).min(1),
  educationDetails: z.array(educationItemSchema).min(1),
});

export type ApplyJobFormData = z.infer<typeof applyJobSchema>;

export default function ApplyJob() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [isParsing, setIsParsing] = useState(false);

  const {
    register,
    watch,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
    trigger,
  } = useForm<ApplyJobFormData>({
    resolver: zodResolver(applyJobSchema),
    defaultValues: {
      jobId: Number(id),
      firstName: "",
      middleName: "",
      lastName: "",
      email: "",
      mobilePhone: "",
      dateOfBirth: "",
      gender: "",
      totalExperience: "",
      noticePeriod: undefined,
      currentSalary: "",
      skills: "",
      experienceDetails: [
        {
          companyName: "",
          jobTitle: "",
          currentlyWorking: false,
          dateOfJoining: "",
          dateOfRelieving: "",
          description: ""
        },
      ],
      educationDetails: [
        {
          course: "",
          branch: "",
          university: "",
          startOfCourse: "",
          endOfCourse: "",
        },
      ],
    },
  });

  const { fields: expFields, append: addExp, remove: remExp } = useFieldArray({ control, name: "experienceDetails" });
  const { fields: eduFields, append: addEdu, remove: remEdu } = useFieldArray({ control, name: "educationDetails" });

  const steps = [
    { id: 1, title: "Resume", icon: FileText },
    { id: 2, title: "Identity", icon: User },
    { id: 3, title: "Professional", icon: Briefcase },
    { id: 4, title: "Experience", icon: GraduationCap },
  ];

  const handleNext = async () => {
    let fieldsToValidate: (keyof ApplyJobFormData)[] = [];
    if (step === 1) {
      if (!file) return toast.info("Please upload your resume first");
      setStep(step + 1);
      return;
    }
    if (step === 2) fieldsToValidate = ["firstName", "lastName", "email", "mobilePhone", "dateOfBirth", "gender"];
    if (step === 3) fieldsToValidate = ["totalExperience", "noticePeriod", "currentSalary", "skills"];

    const isValid = step === 4 ? await trigger() : await trigger(fieldsToValidate);
    if (isValid) setStep(step + 1);
  };

  const handleResumeUpload = async (selectedFile: File) => {
    setFile(selectedFile);
    const formData = new FormData();
    formData.append("resume", selectedFile);
    setIsParsing(true);

    const toastId = toast.loading("AI is parsing your resume...");
    try {
      const res = await axiosInstance.post("/applications/parse-resume", formData);
      
      if (res.data.success && res.data.data) {
        const parsed = res.data.data;
        
        const fields: (keyof ApplyJobFormData)[] = [
          "firstName", "middleName", "lastName", "email", "mobilePhone", 
          "dateOfBirth", "gender", "totalExperience", "noticePeriod", 
          "currentSalary", "skills"
        ];

        fields.forEach(field => {
          if (parsed[field]) {
            setValue(field, String(parsed[field]));
          }
        });

        if (parsed.experienceDetails?.length) {
          remExp();
          parsed.experienceDetails.forEach((exp: any) => addExp(exp));
        }
        if (parsed.educationDetails?.length) {
          remEdu();
          parsed.educationDetails.forEach((edu: any) => addEdu(edu));
        }

        toast.success("Form pre-filled successfully!", { id: toastId });
      } else {
        toast.error("Manual entry may be required.", { id: toastId });
      }
    } catch (err) {
      console.error("Parsing error:", err);
      toast.error("AI parsing failed. Please fill manually.", { id: toastId });
    } finally {
      setIsParsing(false);
    }
  };

  const onSubmit = async (data: ApplyJobFormData) => {
    if (!file) return toast.info("Please upload your resume");

    const formData = new FormData();
    // Append all fields except arrays (stringify them)
    Object.keys(data).forEach((key) => {
      if (key === "experienceDetails" || key === "educationDetails") {
        formData.append(key, JSON.stringify(data[key as keyof ApplyJobFormData]));
      } else if (key !== "jobId") {
        formData.append(key, data[key as keyof ApplyJobFormData] as string);
      }
    });
    formData.append("jobId", String(id));
    formData.append("resume", file);
    try {
      setLoading(true);
      await axiosInstance.post("/applications/apply", formData);
      toast.success("Application Submitted Successfully!");
      navigate("/careers");
    } catch (err) {
      toast.error("Error submitting application. Check console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      <Navbar />
      <div className="bg-[#004d54] pt-12 pb-32 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
          <h1 className="text-3xl font-black text-white tracking-tighter">Join the Maven Team</h1>
          <p className="text-teal-200/60 font-bold uppercase tracking-widest text-[10px] mt-2">Complete the form to submit your candidacy</p>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-6 -mt-20 relative z-20">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-300 hover:text-white mb-8 transition-colors font-bold text-xs uppercase tracking-widest"
        >
          <ArrowLeft size={16} /> Back to Careers
        </button>
        <div className="bg-white p-4 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 mb-8 flex justify-between">
          {steps.map((s, idx) => (
            <div key={s.id} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center gap-2 px-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500 ${step >= s.id ? "bg-[#004d54] text-white" : "bg-slate-100 text-slate-400"
                  }`}>
                  {step > s.id ? <Check size={18} /> : <s.icon size={18} />}
                </div>
                <span className={`text-[9px] font-black uppercase tracking-tighter ${step >= s.id ? "text-[#004d54]" : "text-slate-400"}`}>
                  {s.title}
                </span>
              </div>
              {idx !== steps.length - 1 && (
                <div className={`h-[2px] flex-1 mx-2 rounded-full ${step > s.id ? "bg-orange-500" : "bg-slate-100"}`} />
              )}
            </div>
          ))}
        </div>
        <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/60 border border-slate-100 overflow-hidden">
          <form onSubmit={handleSubmit(onSubmit)} className="p-8 md:p-12">

            {step === 1 && (
              <div className="space-y-8 animate-in slide-in-from-right-4 duration-500 text-center">
                <div className="border-b border-slate-100 pb-4">
                  <h2 className="text-2xl font-black text-slate-800 tracking-tight">Upload Resume</h2>
                  <p className="text-slate-400 text-xs mt-1">Upload your resume to auto-fill the application form</p>
                </div>
                <div className="border-4 border-dashed border-slate-100 rounded-3xl p-12 bg-slate-50/50 hover:border-[#004d54]/30 transition-colors relative group">
                  <UploadCloud size={60} className="mx-auto text-slate-200 group-hover:text-[#004d54] transition-colors mb-4" />
                  <input 
                    type="file" 
                    accept=".pdf" 
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) handleResumeUpload(f);
                    }} 
                    className="absolute inset-0 opacity-0 cursor-pointer" 
                  />
                  <p className="text-slate-500 font-bold">Drag your PDF here or <span className="text-[#004d54] underline">browse</span></p>
                  {file && <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-[#004d54] text-white rounded-full text-xs font-bold"><FileText size={14} /> {file.name}</div>}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
                <div className="border-b border-slate-100 pb-4"><h2 className="text-2xl font-black text-slate-800 tracking-tight">Personal Details</h2></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="form-label">First Name <span className="text-orange-500">*</span></label>
                    <input {...register("firstName")} className="input-field" placeholder="John" />
                    {errors.firstName && <p className="text-red-500 text-[10px] font-bold mt-1">{errors.firstName.message}</p>}
                  </div>
                  <div className="space-y-1">
                    <label className="form-label">Last Name <span className="text-orange-500">*</span></label>
                    <input {...register("lastName")} className="input-field" placeholder="kumar" />
                    {errors.lastName && <p className="text-red-500 text-[10px] font-bold mt-1">{errors.lastName.message}</p>}
                  </div>
                  <div className="md:col-span-2 space-y-1">
                    <label className="form-label">Email Address <span className="text-orange-500">*</span></label>
                    <input {...register("email")} type="email" className="input-field" placeholder="john@example.com" />
                    {errors.email && <p className="text-red-500 text-[10px] font-bold mt-1">{errors.email.message}</p>}
                  </div>
                  <div className="space-y-1">
                    <label className="form-label">Mobile Number  <span className="text-orange-500">*</span></label>
                    <input {...register("mobilePhone")} className="input-field" placeholder="9789667235" />
                    {errors.mobilePhone && <p className="text-red-500 text-[10px] font-bold mt-1">{errors.mobilePhone.message}</p>}
                  </div>
                  <div className="space-y-1">
                    <label className="form-label">Date of Birth<span className="text-orange-500">*</span></label>
                    <input {...register("dateOfBirth")} type="date" className="input-field" />
                    {errors.dateOfBirth && <p className="text-red-500 text-[10px] font-bold mt-1">{errors.dateOfBirth.message}</p>}
                  </div>
                  <div className="space-y-1">
                    <label className="form-label">Gender<span className="text-orange-500">*</span></label>
                    <select {...register("gender")} className="input-field">
                    {["Male", "Female", "Others"].map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                    </select>
                    {errors.gender && <p className="text-red-500 text-[10px] font-bold mt-1">{errors.gender.message}</p>}
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
                <div className="border-b border-slate-100 pb-4"><h2 className="text-2xl font-black text-slate-800 tracking-tight">Professional Summary</h2></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="form-label">Total Experience<span className="text-orange-500">*</span></label>
                    <input {...register("totalExperience")} placeholder="e.g. 5 Years" className="input-field" />
                    {errors.totalExperience && <p className="text-red-500 text-[10px] font-bold mt-1">{errors.totalExperience.message}</p>}
                  </div>
                  <div className="space-y-1">
                    <label className="form-label"> Notice Period (Days)<span className="text-orange-500">*</span></label>
                    <input {...register("noticePeriod")} type="number" className="input-field" />
                    {errors.noticePeriod && <p className="text-red-500 text-[10px] font-bold mt-1">{errors.noticePeriod.message}</p>}
                  </div>
                  <div className="space-y-1">
                    <label className="form-label">Current Salary (LPA)<span className="text-orange-500">*</span></label>
                    <input {...register("currentSalary")} className="input-field" />
                    {errors.currentSalary && <p className="text-red-500 text-[10px] font-bold mt-1">{errors.currentSalary.message}</p>}
                  </div>
                  <div className="md:col-span-2 space-y-1">
                    <label className="form-label">Key Skills<span className="text-orange-500">*</span></label>
                    <textarea {...register("skills")} className="input-field min-h-[100px]" placeholder="React, Node.js, AWS..." />
                    {errors.skills && <p className="text-red-500 text-[10px] font-bold mt-1">{errors.skills.message}</p>}
                  </div>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-10 animate-in slide-in-from-right-4 duration-500">
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-black text-slate-800 tracking-tight">Experience Details</h2>
                    <button type="button" onClick={() => addExp({ companyName: "", jobTitle: "", currentlyWorking: false, dateOfJoining: "", dateOfRelieving: "", description: "" })}
                      className="bg-orange-50 text-orange-600 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-orange-100 transition-colors">
                      + Add
                    </button>
                  </div>
                  {expFields.map((field, index) => {
                    const isCurrentlyWorking = watch(`experienceDetails.${index}.currentlyWorking`);

                    return (
                      <div key={field.id} className="relative p-6 bg-slate-50 rounded-[2rem] border border-slate-100 mb-4 group">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="form-label">Company Name<span className="text-orange-500">*</span></label>
                            <input
                              {...register(`experienceDetails.${index}.companyName`)}
                              placeholder="Company Name"
                              className="input-field"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="form-label">Job Title<span className="text-orange-500">*</span></label>
                            <input
                              {...register(`experienceDetails.${index}.jobTitle`)}
                              placeholder="Job Title"
                              className="input-field"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="form-label">Date of Joining<span className="text-orange-500">*</span></label>
                            <input
                              {...register(`experienceDetails.${index}.dateOfJoining`)}
                              type="date"
                              className="input-field"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="form-label">Date of Relieving</label>
                            <input
                              {...register(`experienceDetails.${index}.dateOfRelieving`)}
                              type="date"
                              disabled={isCurrentlyWorking}
                              className="input-field disabled:bg-gray-200"
                            />
                          </div>
                          <div className="flex items-center gap-2 mt-2">
                            <input
                              type="checkbox"
                              {...register(`experienceDetails.${index}.currentlyWorking`)}
                              className="w-4 h-4"
                              id={`currentlyWorking-${index}`}
                            />
                            <label
                              htmlFor={`currentlyWorking-${index}`}
                              className="form-label !mb-0 cursor-pointer"
                            >
                              Currently working here
                            </label>
                          </div>
                          <div className="md:col-span-2 space-y-1">
                            <label className="form-label">
                              Responsibilities & Achievements<span className="text-orange-500">*</span>
                            </label>
                            <textarea
                              {...register(`experienceDetails.${index}.description`)}
                              rows={4}
                              className="input-field"
                              placeholder="Describe your responsibilities..."
                            />
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => remExp(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    );
                  })}
                </div>
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-black text-slate-800 tracking-tight">Education Details</h2>
                    <button type="button" onClick={() => addEdu({ course: "", branch: "", university: "", startOfCourse: "", endOfCourse: "" })}
                      className="bg-orange-50 text-orange-600 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-orange-100 transition-colors">
                      + Add
                    </button>
                  </div>
                  {eduFields.map((field, index) => (
                    <div key={field.id} className="relative p-6 bg-slate-50 rounded-[2rem] border border-slate-100 mb-4 group">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="form-label">Course Name<span className="text-orange-500">*</span></label>
                          <input {...register(`educationDetails.${index}.course`)} placeholder="B-Tech" className="input-field" />
                        </div>
                        <div className="space-y-1">
                          <label className="form-label">Branch<span className="text-orange-500">*</span></label>
                          <input {...register(`educationDetails.${index}.branch`)} placeholder="ECE" className="input-field" />
                        </div>
                        <div className="space-y-1">
                          <label className="form-label">University<span className="text-orange-500">*</span></label>
                          <input {...register(`educationDetails.${index}.university`)} placeholder="IIT Medras" className="input-field" />
                        </div>
                        <div className="space-y-1">
                          <label className="form-label">Start of course<span className="text-orange-500">*</span></label>
                          <input {...register(`educationDetails.${index}.startOfCourse`)} type="date" className="input-field" />
                        </div>
                        <div className="space-y-1">
                          <label className="form-label">End of course<span className="text-orange-500">*</span></label>
                          <input {...register(`educationDetails.${index}.endOfCourse`)} type="date" className="input-field" />
                        </div>
                      </div>
                      <button type="button" onClick={() => remEdu(index)} className="absolute -top-2 -right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-2xl flex items-center gap-4 animate-in fade-in duration-700">
                  <div className="w-12 h-12 bg-emerald-500 text-white rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-emerald-200">
                    <Check size={24} />
                  </div>
                  <div>
                    <h4 className="font-black text-emerald-900 text-sm">Resume Uploaded</h4>
                    <p className="text-emerald-700/60 text-[10px] font-bold uppercase tracking-widest">You can now submit your application</p>
                  </div>
                </div>
              </div>
            )}
            <div className="flex items-center justify-between mt-12 pt-8 border-t border-slate-100">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  disabled={loading || isParsing}
                  className="flex items-center gap-2 text-slate-400 font-black text-[10px] uppercase tracking-[0.2em] hover:text-[#004d54] transition-all group disabled:opacity-50"
                >
                  <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                  Previous
                </button>
              ) : <div />}

              {step < 4 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={loading || isParsing}
                  className="relative group overflow-hidden"
                >
                  <div className={`flex items-center gap-4 px-10 py-4 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] transition-all duration-300 bg-[#004d54] text-white hover:bg-slate-800 shadow-xl shadow-teal-900/10 ${(loading || isParsing) ? "opacity-70 cursor-not-allowed" : "active:scale-95"}`}>
                    <span>
                      {isParsing ? "AI Parsing..." : "Continue"}
                    </span>
                    {!(loading || isParsing) && (
                      <div className="bg-white/10 p-1 rounded-lg group-hover:bg-white/20 transition-colors">
                        <ChevronRight size={18} />
                      </div>
                    )}
                  </div>
                  <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:animate-shine" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading || isParsing}
                  className="relative group overflow-hidden"
                >
                  <div className={`flex items-center gap-4 px-10 py-4 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] transition-all duration-300 bg-orange-500 text-white hover:bg-orange-600 shadow-xl shadow-orange-200 ${(loading || isParsing) ? "opacity-70 cursor-not-allowed" : "active:scale-95"}`}>
                    <span>
                      {loading ? "Submitting..." : "Submit"}
                    </span>
                    {!(loading || isParsing) && (
                      <div className="bg-white/10 p-1 rounded-lg group-hover:bg-white/20 transition-colors">
                        <Check size={18} />
                      </div>
                    )}
                  </div>
                  <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:animate-shine" />
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

import { ArrowRight, Code2, Cpu, ShieldCheck } from 'lucide-react';
import Navbar from '../components/Layout/NavBar';
import Footer from '../components/Layout/Footer';
import { useNavigate } from 'react-router-dom';
import { axiosInstance } from '../lib/axios';
import { useEffect } from 'react';
interface ServiceCardProps {
  icon: React.ReactNode;
  title: string;
  desc: string;
}

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHealth = async (retries = 3) => {
      try {
        const res = await axiosInstance.get("/health");
        console.log("Health:", res.data);
      } catch (err) {
        if (retries > 0) {
          console.log("Retrying...", retries);
          setTimeout(() => fetchHealth(retries - 1), 2000);
        } else {
          console.error("Backend is down");
        }
      }
    };

    fetchHealth();
  }, []);
  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans selection:bg-orange-100 selection:text-orange-600">
      <Navbar />
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[60%] rounded-full bg-orange-100/50 blur-[120px]" />
          <div className="absolute bottom-0 right-[-5%] w-[30%] h-[50%] rounded-full bg-blue-100/40 blur-[100px]" />
        </div>

        <div className="max-w-7xl mx-auto px-6 text-center">

          <h1 className="text-5xl md:text-7xl font-black text-[#004d54] tracking-tight mb-6 leading-[1.1]">
            Empowering Your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-600">
              Digital Evolution
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-lg text-slate-600 mb-10 leading-relaxed">
            MAVENS-i delivers bespoke technology solutions designed to scale.
            From cloud architecture to custom software, we are your dedicated partner in growth.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate("/careers")}
              className="px-8 py-4 bg-[#004d54] text-white rounded-2xl font-bold shadow-lg shadow-teal-900/20 hover:bg-[#003a3f] transition-all hover:-translate-y-1 flex items-center gap-2">
              Join Our Team <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-14">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-xl">
            <h2 className="text-sm font-black text-orange-500 uppercase tracking-[0.3em] mb-4">Our Expertise</h2>
            <h3 className="text-4xl font-bold text-[#004d54]">Solving complex problems with elegant code.</h3>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <ServiceCard
            icon={<Code2 className="text-orange-500" />}
            title="Custom Software"
            desc="Tailor-made applications built with modern stacks like React, Node, and Python."
          />
          <ServiceCard
            icon={<Cpu className="text-teal-600" />}
            title="Cloud Infrastructure"
            desc="Scalable AWS/Azure solutions that ensure your uptime stays at 99.9%."
          />
          <ServiceCard
            icon={<ShieldCheck className="text-blue-500" />}
            title="Cyber Security"
            desc="Hardening your digital assets against modern threats with proactive audits."
          />
        </div>
      </section>
      <Footer />
    </div>
  );
};
const ServiceCard = ({ icon, title, desc }: ServiceCardProps) => (
  <div className="group p-8 bg-white border border-slate-100 rounded-[2rem] shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 hover:-translate-y-2">
    <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <h4 className="text-xl font-bold text-[#004d54] mb-3">{title}</h4>
    <p className="text-slate-500 leading-relaxed text-sm">
      {desc}
    </p>
  </div>
);

export default Home;
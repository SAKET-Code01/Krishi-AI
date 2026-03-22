import { motion } from "framer-motion";
import { Briefcase, MapPin, Clock, ArrowLeft, Plus } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

const FarmJobs = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const jobs = [
    { id: 1, title: "Rice Harvesting Workers", location: "Cuttack, Odisha", wage: "400/day", duration: "2 weeks", posted: "2h ago", type: t("jobs.type.harvesting") },
    { id: 2, title: "Farm Supervisor", location: "Puri, Odisha", wage: "15,000/month", duration: "6 months", posted: "5h ago", type: t("jobs.type.fulltime") },
    { id: 3, title: "Tractor Operator", location: "Sambalpur, Odisha", wage: "500/day", duration: "1 month", posted: "1d ago", type: t("jobs.type.seasonal") },
    { id: 4, title: "Vegetable Picking", location: "Bhubaneswar, Odisha", wage: "350/day", duration: "3 weeks", posted: "1d ago", type: t("jobs.type.harvesting") },
    { id: 5, title: "Irrigation Technician", location: "Berhampur, Odisha", wage: "18,000/month", duration: "Permanent", posted: "3d ago", type: t("jobs.type.fulltime") },
  ];

  const typeColors: Record<string, string> = {
    [t("jobs.type.harvesting")]: "bg-accent/10 text-accent border-accent/20",
    [t("jobs.type.fulltime")]: "bg-primary/10 text-primary border-primary/20",
    [t("jobs.type.seasonal")]: "bg-secondary/10 text-secondary border-secondary/20",
  };

  return (
    <div className="min-h-screen bg-mesh pb-28">
      <div className="glass-card border-b border-white/30 px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="p-2 rounded-xl hover:bg-muted">
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </button>
            <div>
              <h1 className="text-xl font-display font-bold text-foreground flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-primary" />
                {t("jobs.title")}
              </h1>
              <p className="text-xs font-body text-muted-foreground">{t("jobs.subtitle")}</p>
            </div>
          </div>
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-1 px-4 py-2 rounded-xl bg-primary text-primary-foreground font-display font-semibold text-sm"
          >
            <Plus className="w-4 h-4" />
            {t("jobs.post")}
          </motion.button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-4 space-y-3">
        {jobs.map((job, i) => (
          <motion.div
            key={job.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="glass-card border border-white/30 rounded-2xl p-4 card-hover-glow shadow-card"
          >
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-display font-bold text-foreground">{job.title}</h3>
              <span className={`text-xs font-display font-semibold px-2.5 py-1 rounded-lg border ${typeColors[job.type] || typeColors[t("jobs.type.seasonal")]}`}>
                {job.type}
              </span>
            </div>
            <div className="space-y-1.5 text-sm font-body text-muted-foreground">
              <p className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" />{job.location}</p>
              <p className="flex items-center gap-1.5">₹{job.wage}</p>
              <p className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />{job.duration} • {job.posted}</p>
            </div>
            <motion.button
              whileTap={{ scale: 0.97 }}
              className="mt-3 w-full py-2.5 rounded-xl border-2 border-primary text-primary font-display font-semibold text-sm hover:bg-primary/5 transition-colors"
            >
              {t("jobs.apply")}
            </motion.button>
          </motion.div>
        ))}
      </div>

      <BottomNav />
    </div>
  );
};

export default FarmJobs;

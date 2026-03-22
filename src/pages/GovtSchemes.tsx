import { motion } from "framer-motion";
import { FileText, ArrowLeft, ExternalLink, IndianRupee, Shield, Sprout } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

const GovtSchemes = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const schemes = [
    {
      id: 1,
      name: "PM-Kisan Samman Nidhi",
      category: t("schemes.cat.subsidy"),
      amount: "₹6,000/year",
      desc: "Direct income support of ₹6,000 per year to eligible farmer families in three installments.",
      icon: IndianRupee,
      url: "https://pmkisan.gov.in/",
    },
    {
      id: 2,
      name: "Pradhan Mantri Fasal Bima Yojana",
      category: t("schemes.cat.insurance"),
      amount: "Up to full coverage",
      desc: "Crop insurance scheme covering natural calamities, pests, and diseases.",
      icon: Shield,
      url: "https://pmfby.gov.in/",
    },
    {
      id: 3,
      name: "Kisan Credit Card (KCC)",
      category: t("schemes.cat.loan"),
      amount: "Up to ₹3 lakh",
      desc: "Short-term credit for crop production with subsidized interest rate of 4%.",
      icon: IndianRupee,
      url: "https://www.pmjdy.gov.in/scheme",
    },
    {
      id: 4,
      name: "Soil Health Card Scheme",
      category: t("schemes.cat.support"),
      amount: "Free",
      desc: "Free soil testing and health card with crop-wise fertilizer recommendations.",
      icon: Sprout,
      url: "https://soilhealth.dac.gov.in/",
    },
    {
      id: 5,
      name: "KALIA Scheme (Odisha)",
      category: t("schemes.cat.subsidy"),
      amount: "₹10,000/season",
      desc: "Financial assistance to small farmers for cultivation in Odisha.",
      icon: IndianRupee,
      url: "https://kalia.odisha.gov.in/",
    },
  ];

  const categoryColors: Record<string, string> = {
    [t("schemes.cat.subsidy")]: "bg-primary/10 text-primary border-primary/20",
    [t("schemes.cat.insurance")]: "bg-secondary/10 text-secondary border-secondary/20",
    [t("schemes.cat.loan")]: "bg-accent/10 text-accent border-accent/20",
    [t("schemes.cat.support")]: "bg-muted text-muted-foreground border-border",
  };

  return (
    <div className="min-h-screen bg-mesh pb-28">
      <div className="glass-card border-b border-white/30 px-4 py-4">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 rounded-xl hover:bg-muted">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <div>
            <h1 className="text-xl font-display font-bold text-foreground flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              {t("schemes.title")}
            </h1>
            <p className="text-xs font-body text-muted-foreground">{t("schemes.subtitle")}</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-4 space-y-3">
        {schemes.map((scheme, i) => {
          const Icon = scheme.icon;

          return (
            <motion.div
              key={scheme.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass-card border border-white/30 rounded-2xl p-4 card-hover-glow shadow-card"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon className="w-4.5 h-4.5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-foreground text-sm">{scheme.name}</h3>
                    <span className={`text-xs font-display font-semibold px-2 py-0.5 rounded-md border ${categoryColors[scheme.category]}`}>
                      {scheme.category}
                    </span>
                  </div>
                </div>
                <p className="font-display font-bold text-primary text-sm">{scheme.amount}</p>
              </div>
              <p className="text-sm font-body text-muted-foreground mt-2">{scheme.desc}</p>
              <a
                href={scheme.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-1.5 text-sm font-display font-semibold text-primary hover:underline transition-colors"
              >
                {t("schemes.check")} <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </motion.div>
          );
        })}
      </div>

      <BottomNav />
    </div>
  );
};

export default GovtSchemes;

import { motion } from "framer-motion";
import {
  CloudSun,
  Droplets,
  Thermometer,
  Wind,
  AlertTriangle,
  TrendingUp,
  Bell,
  Sprout,
  Sparkles,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardCard from "@/components/DashboardCard";
import BottomNav from "@/components/BottomNav";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useLanguage } from "@/contexts/LanguageContext";

const insightFallbacks = {
  en: {
    mock: "Ideal time to sow mustard seeds this week for better yield.",
    default: "Focus on field drainage today.",
    error: "Ensure proper irrigation as temperatures rise.",
  },
  hi: {
    mock: "बेहतर उपज के लिए इस सप्ताह सरसों बोना अच्छा रहेगा।",
    default: "आज खेत की जल निकासी पर ध्यान दें।",
    error: "तापमान बढ़ने पर सिंचाई सही रखें।",
  },
  or: {
    mock: "ଭଲ ଫଳନ ପାଇଁ ଏହି ସପ୍ତାହରେ ସୋରିଷ ବୁଣିବା ଉଚିତ।",
    default: "ଆଜି ଖେତର ଜଳ ନିଷ୍କାସନ ଉପରେ ଧ୍ୟାନ ଦିଅନ୍ତୁ।",
    error: "ତାପମାତ୍ରା ବଢ଼ିଲେ ଠିକ୍ ଭାବରେ ସିଚାଇ କରନ୍ତୁ।",
  },
} as const;

const alerts = [
  { id: 1, type: "warning", textKey: "alert.rain" },
  { id: 2, type: "info", textKey: "alert.mustard" },
  { id: 3, type: "danger", textKey: "alert.pest" },
];

const alertColors = {
  warning: "bg-accent/10 border-accent/30 text-accent",
  info: "bg-secondary/10 border-secondary/30 text-secondary",
  danger: "bg-destructive/10 border-destructive/30 text-destructive",
};

const KrishiInsight = () => {
  const { language, t } = useLanguage();
  const [insight, setInsight] = useState(t("dash.insight.analyzing") || "Analyzing your farm data...");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInsight = async () => {
      const fallbackText = insightFallbacks[language];
      
      try {
        const promptText = `You are Krishi AI, a specialized smart farming assistant. Provide a one-sentence, highly practical farming tip in ${
                        language === "or" ? "Odia" : language === "hi" ? "Hindi" : "English"
                      } based on: Location: Bhubaneswar, Temp: 32°C, Weather: Partly Cloudy. Markets: Rice ₹2,150 (up), Wheat ₹2,340 (down). Give me today's pro farming tip.`;

        const response = await fetch("https://krishi-ai-tasn.onrender.com/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message: promptText }),
        });

        if (!response.ok) throw new Error("Backend error");

        const data = await response.json();
        setInsight(data.text || fallbackText.default);
      } catch (error) {
        setInsight(fallbackText.error);
      } finally {
        setLoading(false);
      }
    };

    void fetchInsight();
  }, [language]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-primary/10 border-2 border-primary/20 rounded-3xl p-5 mb-6 relative overflow-hidden"
    >
      <div className="flex items-start gap-4 cursor-default">
        <div className="w-10 h-10 rounded-2xl bg-primary/20 flex items-center justify-center shrink-0">
          <Sparkles className={`w-5 h-5 text-primary ${loading ? "animate-pulse" : ""}`} />
        </div>
        <div>
          <h3 className="text-sm font-display font-bold text-primary mb-1 uppercase tracking-tight">{t("dash.insight.title")}</h3>
          <p className="text-sm font-body text-foreground leading-snug">{insight}</p>
        </div>
      </div>
    </motion.div>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background pb-28">
      <div className="px-4 pt-6 pb-2 flex items-center justify-between bg-background">
        <div>
          <p className="text-muted-foreground font-body text-xs mb-0.5">{t("dash.welcome")}</p>
          <h1 className="text-xl font-display font-bold text-foreground">{t("dash.farmer")}</h1>
        </div>
        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <button className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center border border-border transition-colors hover:bg-muted/80">
            <Bell className="w-5 h-5 text-foreground" />
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-4 space-y-6">
        <KrishiInsight />

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl gradient-hero p-6 shadow-elevated border-2 border-primary-foreground/10"
        >
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-primary-foreground/20 backdrop-blur-md border border-primary-foreground/30 flex items-center justify-center">
                  <CloudSun className="w-8 h-8 text-primary-foreground" />
                </div>
                <div>
                  <h2 className="text-2xl font-display font-extrabold text-primary-foreground">32°C</h2>
                  <p className="text-sm font-body text-primary-foreground/80">{t("weather.partlyCloudy")}</p>
                </div>
              </div>
              <p className="text-[10px] font-display font-bold px-2.5 py-1 rounded-full bg-primary-foreground/20 text-primary-foreground uppercase tracking-wider border border-primary-foreground/20 backdrop-blur-sm">
                Bhubaneswar
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-primary-foreground/10 backdrop-blur-md rounded-2xl p-3 border border-primary-foreground/20">
                <p className="text-[10px] font-display font-semibold text-primary-foreground/60 mb-1 flex items-center gap-1">
                  <Droplets className="w-3 h-3" /> {t("weather.humidity")}
                </p>
                <p className="text-lg font-display font-bold text-primary-foreground">72%</p>
              </div>
              <div className="bg-primary-foreground/10 backdrop-blur-md rounded-2xl p-3 border border-primary-foreground/20">
                <p className="text-[10px] font-display font-semibold text-primary-foreground/60 mb-1 flex items-center gap-1">
                  <Wind className="w-3 h-3" /> {t("weather.windSpeed")}
                </p>
                <p className="text-lg font-display font-bold text-primary-foreground">12 km/h</p>
              </div>
            </div>
          </div>

          <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary-foreground/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-accent/20 rounded-full blur-3xl" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="grid grid-cols-2 gap-4">
            <DashboardCard icon={Thermometer} title={t("dash.temp")} value="32°C" subtitle={`${t("dash.feelsLike")} 35°C`} variant="primary" onClick={() => navigate("/weather")} />
            <DashboardCard icon={Droplets} title={t("dash.rainfall")} value="12mm" subtitle={`${t("dash.expectedIn")} 2 days`} variant="secondary" onClick={() => navigate("/weather")} />
          </div>

          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            onClick={() => navigate("/market")}
            className="bg-card border-2 border-border rounded-3xl p-5 shadow-sm hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-bold text-foreground flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                {t("dash.marketTrends")}
              </h3>
              <span className="text-[10px] font-bold text-primary group-hover:underline">{t("dash.viewAll")}</span>
            </div>
            <div className="space-y-3">
              {[
                { name: t("crop.rice"), price: "₹2,150", change: "+3.2%", up: true },
                { name: t("crop.wheat"), price: "₹2,340", change: "-1.5%", up: false },
                { name: t("crop.mustard"), price: "₹5,200", change: "+5.1%", up: true },
              ].map((crop, i) => (
                <div key={i} className="flex items-center justify-between border-b border-border/50 pb-2 last:border-0 last:pb-0">
                  <span className="text-sm font-body text-foreground">{crop.name}</span>
                  <div className="text-right">
                    <p className="text-sm font-display font-bold text-foreground">{crop.price}</p>
                    <p className={`text-[10px] font-bold ${crop.up ? "text-primary" : "text-destructive"}`}>
                      {crop.change}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <DashboardCard icon={Sprout} title={t("dash.cropHealth")} value={t("dash.good")} subtitle={t("crop.healthyGrowth")} variant="primary" onClick={() => navigate("/crop-doctor")} />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-display font-bold text-foreground flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-accent" />
              {t("dash.alerts")}
            </h2>
            <span className="px-2 py-0.5 rounded-full bg-accent/10 text-accent text-[10px] font-bold border border-accent/20">
              3 {t("dash.activeAlerts")}
            </span>
          </div>
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={`rounded-2xl p-4 border-2 shadow-sm transition-all hover:shadow-md flex items-start gap-3 ${alertColors[alert.type as keyof typeof alertColors]}`}
              >
                <div className={`mt-1 p-1.5 rounded-lg border flex items-center justify-center ${
                  alert.type === "danger"
                    ? "bg-destructive/20 ring-destructive/10"
                    : alert.type === "warning"
                      ? "bg-accent/20 ring-accent/10"
                      : "bg-secondary/20 ring-secondary/10"
                }`}
                >
                  {alert.type === "danger" ? <AlertTriangle className="w-4 h-4" /> : alert.type === "warning" ? <Bell className="w-4 h-4" /> : <Sprout className="w-4 h-4" />}
                </div>
                <p className="text-sm font-body leading-relaxed flex-1">{t(alert.textKey)}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Dashboard;

import { motion } from "framer-motion";
import { ArrowLeft, PieChart as PieChartIcon, TrendingUp, Lightbulb, Droplets, Sprout } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import BottomNav from "@/components/BottomNav";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from "recharts";

const Reports = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const profile = JSON.parse(localStorage.getItem("krishi-ai-profile") || "{}");
  
  const landSize = parseFloat(profile.landSize) || 0;
  const experience = profile.experience || "beginner";

  // Mock analysis logic
  const efficiencyScore = experience === "expert" ? 85 : experience === "intermediate" ? 72 : 60;
  
  const chartData = [
    { name: t("reports.chart.crops"), value: 70 },
    { name: t("reports.chart.fallow"), value: 20 },
    { name: t("reports.chart.other"), value: 10 },
  ];

  const COLORS = ["hsl(var(--primary))", "hsl(var(--secondary))", "hsl(var(--accent))"];

  return (
    <div className="min-h-screen bg-background pb-28">
      {/* Header */}
      <div className="bg-card border-b-2 border-border px-4 py-4">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/dashboard")} className="p-2 rounded-xl hover:bg-muted">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <div>
            <h1 className="text-xl font-display font-bold text-foreground">{t("reports.title")}</h1>
            <p className="text-xs font-body text-muted-foreground">{t("reports.subtitle")}</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Efficiency Score */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-card rounded-2xl p-6 border-2 border-border shadow-card relative overflow-hidden"
        >
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <p className="text-sm font-display font-semibold text-muted-foreground mb-1">{t("reports.efficiency")}</p>
              <h2 className="text-4xl font-display font-extrabold text-primary">{efficiencyScore}%</h2>
              <p className="text-xs font-body text-muted-foreground mt-2 max-w-[200px]">{t("reports.score.desc")}</p>
            </div>
            <div className="w-20 h-20 rounded-full border-8 border-primary/20 flex items-center justify-center">
              <TrendingUp className="w-8 h-8 text-primary" />
            </div>
          </div>
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <TrendingUp className="w-32 h-32" />
          </div>
        </motion.div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card rounded-2xl p-6 border-2 border-border"
          >
            <h3 className="text-lg font-display font-bold text-foreground mb-4 flex items-center gap-2">
              <PieChartIcon className="w-5 h-5 text-secondary" />
              {t("reports.landDist")}
            </h3>
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 mt-2">
               {chartData.map((d, i) => (
                 <div key={d.name} className="flex items-center gap-1.5">
                   <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                   <span className="text-xs font-body text-muted-foreground">{d.name}</span>
                 </div>
               ))}
            </div>
          </motion.div>

          {/* Recommendations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <h3 className="text-lg font-display font-bold text-foreground flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-accent" />
              {t("reports.recommendations")}
            </h3>
            
            <div className="bg-primary/5 border-2 border-primary/10 rounded-2xl p-5 flex gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
                <Sprout className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h4 className="font-display font-bold text-foreground text-sm">{t("reports.diversify.title")}</h4>
                <p className="text-xs font-body text-muted-foreground leading-relaxed mt-1">
                  {t("reports.diversify.desc")}
                </p>
              </div>
            </div>

            <div className="bg-secondary/5 border-2 border-secondary/10 rounded-2xl p-5 flex gap-4">
              <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center shrink-0">
                <Droplets className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <h4 className="font-display font-bold text-foreground text-sm">{t("reports.water.title")}</h4>
                <p className="text-xs font-body text-muted-foreground leading-relaxed mt-1">
                  {t("reports.water.desc")}
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Financials & Risks */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-card rounded-2xl p-6 border-2 border-border"
          >
            <h3 className="text-lg font-display font-bold text-foreground mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              {t("reports.financials")}
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-xs font-body text-muted-foreground">{t("reports.profit.est")}</p>
                  <p className="text-2xl font-display font-extrabold text-foreground">₹{landSize * 45000}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-body text-primary font-bold">↑ 12% {t("reports.vsLY")}</p>
                </div>
              </div>
              <p className="text-xs font-body text-muted-foreground">{t("reports.profit.desc")}</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-card rounded-2xl p-6 border-2 border-border"
          >
            <h3 className="text-lg font-display font-bold text-foreground mb-4 flex items-center gap-2">
              <Droplets className="w-5 h-5 text-secondary" />
              {t("reports.risks")}
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-body text-foreground">{t("reports.risk.weather")}</span>
                <span className="px-2 py-0.5 rounded-full bg-accent/20 text-accent text-[10px] font-bold">{t("reports.risk.medium")}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-body text-foreground">{t("reports.risk.temp")}</span>
                <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary text-[10px] font-bold">{t("reports.risk.stable")}</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Harvesting Strategy */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-card rounded-2xl p-6 border-2 border-border"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-display font-bold text-foreground flex items-center gap-2">
                <Sprout className="w-5 h-5 text-primary" />
                {t("reports.harvesting")}
              </h3>
              <p className="text-xs font-body text-muted-foreground mt-1">{t("reports.harvesting.desc")}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {[
              { name: t("reports.tool.scythes"), price: "₹450", img: "https://images.unsplash.com/photo-1615485290382-441e4d0c9cb5?auto=format&fit=crop&w=100&h=100" },
              { name: t("reports.tool.thresher"), price: "₹25k", img: "https://images.unsplash.com/photo-1596733430284-f7437764b1a9?auto=format&fit=crop&w=100&h=100" },
              { name: t("reports.tool.bags"), price: "₹120", img: "https://images.unsplash.com/photo-1590518779934-8b628f5d0f62?auto=format&fit=crop&w=100&h=100" },
            ].map((p) => (
              <div key={p.name} className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-xl bg-muted mb-2 overflow-hidden border border-border">
                  <img src={p.img} alt={p.name} className="w-full h-full object-cover" />
                </div>
                <p className="text-xs font-display font-bold text-foreground">{p.name}</p>
                <p className="text-[10px] font-body text-primary">{p.price}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/dashboard")}
          className="w-full py-4 rounded-xl border-2 border-border bg-card text-foreground font-display font-bold text-base hover:bg-muted transition-colors"
        >
          {t("reports.backBtn")}
        </motion.button>
      </div>

      <BottomNav />
    </div>
  );
};

export default Reports;

import { motion } from "framer-motion";
import { ArrowLeft, PieChart as PieChartIcon, TrendingUp, Lightbulb, Droplets, Sprout, Target, Star, Zap, Leaf } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import BottomNav from "@/components/BottomNav";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, LineChart, Line, XAxis } from "recharts";

const Reports = () => {
  const navigate = useNavigate();
  const { language, t } = useLanguage();

  const profile = JSON.parse(localStorage.getItem("krishi-ai-profile") || "{}");
  
  const landSize = parseFloat(profile.landSize) || 0;
  const experience = profile.experience || "beginner";

  // Analysis logic
  const efficiencyScore = experience === "expert" ? 85 : experience === "intermediate" ? 72 : 60;
  
  const chartData = [
    { name: t("reports.chart.crops"), value: 70 },
    { name: t("reports.chart.fallow"), value: 20 },
    { name: t("reports.chart.other"), value: 10 },
  ];

  const COLORS = ["hsl(var(--primary))", "hsl(var(--secondary))", "hsl(var(--accent))"];

  const projectedProfit = landSize * 45000;
  
  const currentMonthIndex = new Date().getMonth();
  const getLocalizedMonth = (offset: number) => {
    const d = new Date();
    d.setMonth(d.getMonth() + offset);
    return new Intl.DateTimeFormat(language === "or" ? "or-IN" : language === "hi" ? "hi-IN" : "en-US", { month: "short" }).format(d);
  };
  
  const financialData = [
    { name: getLocalizedMonth(-5), value: projectedProfit * 0.4 },
    { name: getLocalizedMonth(-4), value: projectedProfit * 0.6 },
    { name: getLocalizedMonth(-3), value: projectedProfit * 0.5 },
    { name: getLocalizedMonth(-2), value: projectedProfit * 0.8 },
    { name: getLocalizedMonth(-1), value: projectedProfit * 0.75 },
    { name: getLocalizedMonth(0), value: projectedProfit },
  ];

const getRegionalCrops = (location: string = "", experience: string = "beginner") => {
  const loc = (location || "").toLowerCase();
  
  // Odisha Specific (Default for this app)
  const odishaCrops = {
    beginner: [
      { id: "crop.mustard.31", english: "Pusa Mustard 31", yield: "+25%", type: "Oilseed", icon: <Sprout className="w-5 h-5" />, color: "bg-yellow-500/20 text-yellow-600" },
      { id: "crop.greengram.ipm", english: "Green Gram IPM", yield: "+18%", type: "Pulse", icon: <Leaf className="w-5 h-5" />, color: "bg-green-500/20 text-green-600" }
    ],
    intermediate: [
      { id: "crop.paddy.swarna", english: "Swarna Sub-1 Paddy", yield: "+40%", type: "Flood Resistant", icon: <Sprout className="w-5 h-5" />, color: "bg-emerald-500/20 text-emerald-600" },
      { id: "crop.sugarcane.86032", english: "CO 86032 Sugarcane", yield: "+35%", type: "Cash Crop", icon: <TrendingUp className="w-5 h-5" />, color: "bg-teal-500/20 text-teal-600" }
    ],
    expert: [
      { id: "crop.cotton.bt", english: "Hybrid Bt Cotton", yield: "+55%", type: "High Value", icon: <Star className="w-5 h-5" />, color: "bg-purple-500/20 text-purple-600" },
      { id: "crop.banana.g9", english: "G9 Cavendish Banana", yield: "+50%", type: "Export Quality", icon: <Zap className="w-5 h-5" />, color: "bg-indigo-500/20 text-indigo-600" }
    ]
  };

  // North India (Punjab/Haryana)
  const northIndiaCrops = {
    beginner: [
      { id: "crop.wheat.2967", english: "HD 2967 Wheat", yield: "+22%", type: "Foundational", icon: <Sprout className="w-5 h-5" />, color: "bg-amber-500/20 text-amber-600" },
      { id: "crop.cotton.650", english: "RCH 650 BGII Cotton", yield: "+20%", type: "Fibre", icon: <Leaf className="w-5 h-5" />, color: "bg-blue-500/20 text-blue-600" }
    ],
    intermediate: [
      { id: "crop.rice.basmati", english: "Basmati Pusa 1121", yield: "+35%", type: "Premium Rice", icon: <Sprout className="w-5 h-5" />, color: "bg-yellow-100 text-yellow-700" },
      { id: "crop.wheat.343", english: "PBW 343 Wheat", yield: "+30%", type: "High Return", icon: <TrendingUp className="w-5 h-5" />, color: "bg-orange-500/20 text-orange-600" }
    ],
    expert: [
      { id: "crop.sunflower.hybrid", english: "Hybrid Sunflower", yield: "+45%", type: "Intensive", icon: <Star className="w-5 h-5" />, color: "bg-yellow-500/20 text-yellow-600" },
      { id: "crop.wheat.durum", english: "Durum Wheat", yield: "+40%", type: "Processing Quality", icon: <Zap className="w-5 h-5" />, color: "bg-amber-700/20 text-amber-800" }
    ]
  };

  if (loc.includes("punjab") || loc.includes("haryana") || loc.includes("haryana") || loc.includes("u.p") || loc.includes("uttar pradesh")) {
    return northIndiaCrops[experience as keyof typeof northIndiaCrops] || northIndiaCrops.beginner;
  }
  
  // Default to Odisha/Eastern India patterns
  return odishaCrops[experience as keyof typeof odishaCrops] || odishaCrops.beginner;
};

  return (
    <div className="min-h-screen bg-mesh pb-28">
      {/* Header */}
      <div className="sticky top-0 z-50 glass-card px-4 py-4 mb-6">
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
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-3xl p-8 relative overflow-hidden group"
        >
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
            <div className="relative">
              <svg className="w-32 h-32 transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="58"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  className="text-primary/10"
                />
                <motion.circle
                  cx="64"
                  cy="64"
                  r="58"
                  stroke="currentColor"
                  strokeWidth="8"
                  strokeDasharray={364.4}
                  initial={{ strokeDashoffset: 364.4 }}
                  animate={{ strokeDashoffset: 364.4 - (364.4 * efficiencyScore) / 100 }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  strokeLinecap="round"
                  fill="transparent"
                  className="text-primary"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-display font-black text-foreground">{efficiencyScore}%</span>
                <span className="text-[10px] font-display font-bold text-primary uppercase tracking-wider">Score</span>
              </div>
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-wider mb-3">
                <Target className="w-3 h-3" />
                {efficiencyScore > 80 ? "Optimal Performance" : efficiencyScore > 70 ? "Good Performance" : "Growing Steady"}
              </div>
              <h2 className="text-2xl font-display font-extrabold text-foreground mb-2">{t("reports.efficiency")}</h2>
              <p className="text-sm font-body text-muted-foreground leading-relaxed max-w-md">{t("reports.score.desc")}</p>
            </div>
          </div>
          
          <div className="absolute -bottom-6 -right-6 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity">
            <TrendingUp className="w-48 h-48" />
          </div>
        </motion.div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card rounded-3xl p-6"
          >
            <h3 className="text-lg font-display font-bold text-foreground mb-6 flex items-center gap-2">
              <div className="p-2 rounded-lg bg-secondary/10">
                <PieChartIcon className="w-5 h-5 text-secondary" />
              </div>
              {t("reports.landDist")}
            </h3>
            <div className="h-[220px] w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={85}
                    paddingAngle={8}
                    dataKey="value"
                    stroke="none"
                  >
                    {chartData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={COLORS[index % COLORS.length]}
                        className="hover:opacity-80 transition-opacity cursor-pointer"
                      />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.8)', 
                      borderRadius: '12px', 
                      border: 'none',
                      backdropFilter: 'blur(8px)',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center">
                  <p className="text-[10px] font-display font-bold text-muted-foreground uppercase tracking-tighter">Total Land</p>
                  <p className="text-sm font-display font-black text-foreground">{landSize} Acres</p>
                </div>
              </div>
            </div>
            <div className="flex justify-center gap-6 mt-4">
               {chartData.map((d, i) => (
                 <div key={d.name} className="flex flex-col items-center gap-1">
                   <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                    <span className="text-[10px] font-display font-bold text-foreground uppercase tracking-wider">{d.value}%</span>
                   </div>
                   <span className="text-[10px] font-body text-muted-foreground">{d.name}</span>
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
            <h3 className="text-lg font-display font-bold text-foreground flex items-center gap-2 mb-2">
              <div className="p-2 rounded-lg bg-accent/10">
                <Lightbulb className="w-5 h-5 text-accent" />
              </div>
              {t("reports.recommendations")}
            </h3>
            
            <div className="glass-card rounded-2xl p-5 flex gap-4 hover:shadow-lg hover:shadow-primary/5 transition-all group border-l-4 border-l-primary">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <Sprout className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h4 className="font-display font-bold text-foreground text-sm uppercase tracking-wide">{t("reports.diversify.title")}</h4>
                <p className="text-xs font-body text-muted-foreground leading-relaxed mt-1">
                  {t("reports.diversify.desc")}
                </p>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-5 flex gap-4 hover:shadow-lg hover:shadow-secondary/5 transition-all group border-l-4 border-l-secondary">
              <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <Droplets className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <h4 className="font-display font-bold text-foreground text-sm uppercase tracking-wide">{t("reports.water.title")}</h4>
                <p className="text-xs font-body text-muted-foreground leading-relaxed mt-1">
                  {t("reports.water.desc")}
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Optimal Yield Suggestions */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="glass-card rounded-3xl p-6 md:p-8 relative overflow-hidden group border-2 border-primary/20"
        >
          <div className="absolute top-0 right-0 p-8 opacity-[0.05] group-hover:opacity-[0.1] transition-opacity text-primary">
            <TrendingUp className="w-32 h-32" />
          </div>

          <div className="relative z-10">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
              <div>
                <h3 className="text-xl font-display font-black text-foreground flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Star className="w-6 h-6 text-primary" />
                  </div>
                  {!profile.crops ? "Maximum Yield Recommendations" : "Optimal High-Yield Alternatives"}
                </h3>
                <p className="text-xs font-body text-muted-foreground mt-1 max-w-xl leading-relaxed">
                  {!profile.crops 
                    ? "Based on your location and experience, these crops are projected to deliver the highest returns for your soil profile." 
                    : "Even with your planned rotation, our AI suggests these alternatives for maximum land utilization and ROI."}
                </p>
              </div>
              <div className="px-5 py-2 rounded-full bg-primary/20 text-primary text-[10px] font-black group-hover:scale-105 transition-transform uppercase tracking-widest border border-primary/30 shadow-lg shadow-primary/5">
                AI Powered Data
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {getRegionalCrops(profile.location, experience).map((crop) => (
                <motion.a 
                  key={crop.id}
                  href={`https://www.bighaat.com/search/${encodeURIComponent(crop.english)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-5 rounded-2xl bg-white/40 border border-white/40 hover:bg-white/60 hover:shadow-xl hover:shadow-primary/5 transition-all group/item no-underline cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-2xl ${crop.color} flex items-center justify-center group-hover/item:scale-110 transition-transform shadow-inner`}>
                      {crop.icon}
                    </div>
                    <div>
                      <p className="text-base font-display font-black text-foreground tracking-tight">{t(crop.id)}</p>
                      <p className="text-[10px] font-display font-bold text-muted-foreground uppercase tracking-wider">{crop.type}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-display font-black text-primary">{crop.yield}</p>
                    <p className="text-[9px] font-display font-bold text-muted-foreground uppercase tracking-widest leading-none">
                      {t("reports.yieldGain")}
                    </p>
                  </div>
                </motion.a>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Financials & Risks */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card rounded-3xl p-6 overflow-hidden relative"
          >
            <h3 className="text-lg font-display font-bold text-foreground mb-6 flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              {t("reports.financials")}
            </h3>
            <div className="space-y-6">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-[10px] font-display font-bold text-muted-foreground uppercase tracking-widest mb-1">{t("reports.profit.est")}</p>
                  <p className="text-3xl font-display font-black text-foreground">₹{projectedProfit.toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold">
                    <TrendingUp className="w-3 h-3" />
                    12% {t("reports.vsLY")}
                  </div>
                </div>
              </div>
              
              <div className="h-32 w-full mt-2 -ml-2">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={financialData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#888888', fontSize: 10, fontWeight: 600 }}
                      dy={10}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={4} 
                      dot={false}
                    />
                    <RechartsTooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                        borderRadius: '8px', 
                        border: 'none',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                      }}
                      formatter={(value: number) => [`₹${value.toLocaleString()}`, t("reports.profit.est")]}
                      labelFormatter={() => ''}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <p className="text-xs font-body text-muted-foreground leading-relaxed">{t("reports.profit.desc")}</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card rounded-3xl p-6"
          >
            <h3 className="text-lg font-display font-bold text-foreground mb-6 flex items-center gap-2">
              <div className="p-2 rounded-lg bg-secondary/10">
                <Droplets className="w-5 h-5 text-secondary" />
              </div>
              {t("reports.risks")}
            </h3>
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-display font-bold text-foreground uppercase tracking-wide">{t("reports.risk.weather")}</span>
                  <span className="text-[10px] font-bold text-accent">{t("reports.risk.medium")}</span>
                </div>
                <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: "60%" }}
                    className="h-full bg-accent"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-display font-bold text-foreground uppercase tracking-wide">{t("reports.risk.temp")}</span>
                  <span className="text-[10px] font-bold text-primary">{t("reports.risk.stable")}</span>
                </div>
                <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: "85%" }}
                    className="h-full bg-primary"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Harvesting Strategy */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-card rounded-3xl p-8"
        >
          <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
            <div>
              <h3 className="text-xl font-display font-black text-foreground flex items-center gap-2">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Sprout className="w-6 h-6 text-primary" />
                </div>
                {t("reports.harvesting")}
              </h3>
              <p className="text-xs font-body text-muted-foreground mt-1 max-w-sm">{t("reports.harvesting.desc")}</p>
            </div>
            <button className="px-6 py-2 rounded-xl bg-primary text-primary-foreground font-display font-bold text-sm hover:opacity-90 transition-opacity shadow-lg shadow-primary/20">
              View All Tools
            </button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { 
                name: "Battery Operated Sprayer (16L)", 
                price: "Starts from ₹2,100", 
                img: "/images/tools/tool_sprayer.png", // Custom 3D Icon
                link: "https://www.bighaat.com/search/sprayer" 
              },
              { 
                name: "Heavy Duty Tarpaulin", 
                price: "Starts from ₹800", 
                img: "/images/tools/tool_tarpaulin.png", // Custom 3D Icon
                link: "https://www.bighaat.com/search/tarpaulin" 
              },
              { 
                name: "Manual Harvesting Sickle", 
                price: "Starts from ₹150", 
                img: "/images/tools/tool_sickle.png", // Custom 3D Icon
                link: "https://www.bighaat.com/search/sickle" 
              },
            ].map((p, idx) => (
              <motion.a 
                href={p.link}
                target="_blank"
                rel="noopener noreferrer"
                key={p.name} 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + (idx * 0.1) }}
                className="flex flex-col items-center p-4 rounded-3xl bg-white/50 border border-white/40 hover:bg-white/80 hover:shadow-xl hover:shadow-primary/10 transition-all group cursor-pointer no-underline"
              >
                <div className="w-24 h-24 rounded-2xl bg-muted mb-4 overflow-hidden border-2 border-white/50 group-hover:scale-105 group-hover:border-primary/50 transition-all">
                  <img src={p.img} alt={p.name} className="w-full h-full object-cover" />
                </div>
                <p className="text-sm font-display font-black text-foreground tracking-tight text-center">{p.name}</p>
                <p className="text-xs font-display font-bold text-primary mt-1">{p.price}</p>
                <div className="mt-3 px-3 py-1 bg-primary/10 rounded-full">
                  <span className="text-[9px] font-display font-bold text-primary uppercase tracking-widest leading-none">Buy on BigHaat</span>
                </div>
              </motion.a>
            ))}
          </div>
        </motion.div>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/dashboard")}
          className="w-full py-5 rounded-2xl glass-card text-foreground font-display font-black text-base hover:bg-primary hover:text-primary-foreground transition-all shadow-xl hover:shadow-primary/20 group"
        >
          <span className="flex items-center justify-center gap-2 uppercase tracking-widest">
            {t("reports.backBtn")}
            <ArrowLeft className="w-4 h-4 transform rotate-180 group-hover:translate-x-1 transition-transform" />
          </span>
        </motion.button>
      </div>

      <BottomNav />
    </div>
  );
};

export default Reports;

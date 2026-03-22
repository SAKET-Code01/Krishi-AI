import { motion, AnimatePresence } from "framer-motion";
import {
  CloudSun,
  Droplets,
  Thermometer,
  Wind,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Bell,
  Sprout,
  Sparkles,
  MessageSquare,
  MapPin,
  FileText,
  ChevronRight,
  Leaf,
  Sun,
  ArrowUpRight,
  Briefcase,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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

const alertStyles = {
  warning: { bg: "bg-accent/8 border-accent/20", text: "text-accent", strip: "bg-accent" },
  info: { bg: "bg-secondary/8 border-secondary/20", text: "text-secondary", strip: "bg-secondary" },
  danger: { bg: "bg-destructive/8 border-destructive/20", text: "text-destructive", strip: "bg-destructive" },
};

const getGreeting = (): { text: string; emoji: string } => {
  const hour = new Date().getHours();
  if (hour < 6) return { text: "Good Night", emoji: "🌙" };
  if (hour < 12) return { text: "Good Morning", emoji: "🌅" };
  if (hour < 17) return { text: "Good Afternoon", emoji: "☀️" };
  return { text: "Good Evening", emoji: "🌆" };
};

const KrishiInsight = ({ temp, condition }: { temp: string; condition: string }) => {
  const { language, t } = useLanguage();
  const [insight, setInsight] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!temp || !condition) {
      setInsight(t("dash.insight.analyzing") || "Analyzing your farm data...");
      return;
    }

    const fetchInsight = async () => {
      setLoading(true);
      setInsight(t("dash.insight.analyzing") || "Analyzing your farm data...");
      const fallbackText = insightFallbacks[language];
      try {
        const stored = localStorage.getItem("krishi-ai-profile");
        const profile = stored ? JSON.parse(stored) : null;
        const userLoc = profile?.location || "Bhubaneswar";

        const promptText = `You are Krishi AI, a specialized smart farming assistant. Provide a one-sentence, highly practical farming tip in ${
          language === "or" ? "Odia" : language === "hi" ? "Hindi" : "English"
        } based on: Location: ${userLoc}, Temp: ${temp}, Weather: ${condition}. Markets: Rice ₹2,150 (up), Wheat ₹2,340 (down). Give me today's pro farming tip.`;

        const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3001";
        const response = await fetch(`${backendUrl}/api/chat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: promptText }),
        });
        if (!response.ok) throw new Error("Backend error");
        const data = await response.json();
        if (data.text) setInsight(data.text);
        else setInsight(fallbackText.default); // Fallback if data.text is empty
      } catch (error) {
        console.error("Failed to fetch insight:", error);
        setInsight(fallbackText.error);
      } finally {
        setLoading(false);
      }
    };
    void fetchInsight();
  }, [language, temp, condition, t]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-2xl p-4 border border-primary/15 glass-card shadow-card"
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center shrink-0">
          <Sparkles className={`w-5 h-5 text-primary ${loading ? "animate-pulse" : ""}`} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-[10px] font-display font-bold text-primary mb-0.5 uppercase tracking-widest">{t("dash.insight.title")}</h3>
          <p className="text-sm font-body text-foreground leading-relaxed">{insight}</p>
        </div>
      </div>
      <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-primary/5 rounded-full blur-2xl" />
    </motion.div>
  );
};

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const greeting = getGreeting();
  const [notifDot, setNotifDot] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const [userLocation, setUserLocation] = useState("Bhubaneswar");
  const [weatherData, setWeatherData] = useState({ temp: "", condition: "", humidity: "", wind: "" });
  const [loadingWeather, setLoadingWeather] = useState(true);

  const [notifications, setNotifications] = useState([
    { id: 1, title: "Market Update", message: "Rice prices increased by 3.2% in your area.", time: "2h ago", read: false },
    { id: 2, title: "Weather Alert", message: "Light rain expected tomorrow evening. Plan accordingly.", time: "5h ago", read: false },
    { id: 3, title: "New Scheme", message: "PM-Kisan new installment released. Check eligibility.", time: "1d ago", read: true },
  ]);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const stored = localStorage.getItem("krishi-ai-profile");
        const profile = stored ? JSON.parse(stored) : null;
        const location = profile?.location || "Bhubaneswar";
        setUserLocation(location.split(",")[0]); // Show short name

        // 1. Geocoding (Location Name -> Lat/Lon)
        const geoRes = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(location)}&format=json&limit=1`);
        const geoData = await geoRes.json();
        
        if (geoData && geoData[0]) {
          const { lat, lon } = geoData[0];
          
          // 2. Weather Data (Open-Meteo)
          const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&daily=weather_code,precipitation_probability_max,temperature_2m_max&timezone=auto`);
          const weather = await weatherRes.json();
          
          if (weather && weather.current) {
            const wCode = weather.current.weather_code;
            let condition = t("weather.sunny");
            if (wCode > 0 && wCode < 45) condition = t("weather.partlyCloudy");
            if (wCode >= 45 && wCode < 60) condition = t("weather.cloudy");
            if (wCode >= 60) condition = t("weather.rainy");

            setWeatherData({
              temp: `${Math.round(weather.current.temperature_2m)}°C`,
              condition,
              humidity: `${weather.current.relative_humidity_2m}%`,
              wind: `${Math.round(weather.current.wind_speed_10m)} km/h`,
            });

            // Update notifications based on forecast
            const newNotifs = [...notifications];
            const maxRain = Math.max(...weather.daily.precipitation_probability_max);
            if (maxRain > 50) {
              newNotifs.unshift({
                id: Date.now(),
                title: "Rain Alert",
                message: `High chance of rain (${maxRain}%) in the next few days. Check your fields.`,
                time: "Just now",
                read: false
              });
              setNotifDot(true);
            }
            const maxTemp = Math.max(...weather.daily.temperature_2m_max);
            if (maxTemp > 38) {
              newNotifs.unshift({
                id: Date.now() + 1,
                title: "Heat Wave",
                message: `Wait for extreme heat (${Math.round(maxTemp)}°C) this week. Irrigate early.`,
                time: "Just now",
                read: false
              });
              setNotifDot(true);
            }
            setNotifications(newNotifs.slice(0, 5));
          }
        }
      } catch (error) {
        console.error("Weather fetch failed:", error);
      } finally {
        setLoadingWeather(false);
      }
    };
    void fetchWeather();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [t]);

  const quickActions = [
    { icon: MessageSquare, label: "AI Chat", path: "/ai-chat", color: "from-primary to-emerald-800" },
    { icon: TrendingUp, label: "Market", path: "/market", color: "from-amber-700 to-orange-900" },
    { icon: FileText, label: "Schemes", path: "/schemes", color: "from-orange-800 to-amber-950" }, // Deep Brown/Terracotta
    { icon: Briefcase, label: "Jobs", path: "/jobs", color: "from-stone-700 to-emerald-900" }, // Stone/Forest
  ];

  const crops = [
    { name: t("crop.rice"), price: "₹2,150", change: "+3.2%", up: true },
    { name: t("crop.wheat"), price: "₹2,340", change: "-1.5%", up: false },
    { name: t("crop.mustard"), price: "₹5,200", change: "+5.1%", up: true },
  ];

  const cropProgress = [
    { name: "Rice (Kharif)", stage: "Flowering", progress: 72, emoji: "🌾" },
    { name: "Mustard", stage: "Seeding", progress: 15, emoji: "🌿" },
  ];

  return (
    <div className="min-h-screen bg-mesh pb-28">
      {/* Header */}
      <div className="px-4 pt-5 pb-2 flex items-center justify-between">
        <div>
          <p className="text-muted-foreground font-body text-xs mb-0.5 flex items-center gap-1">
            {greeting.emoji} {greeting.text}
          </p>
          <h1 className="text-xl font-display font-bold text-foreground">{t("dash.farmer")}</h1>
        </div>
        <div className="flex items-center gap-2 relative">
          <LanguageSwitcher />
          <button
            onClick={() => {
              setNotifDot(false);
              setShowNotifications(!showNotifications);
            }}
            className="relative w-10 h-10 rounded-2xl bg-card/60 backdrop-blur-sm flex items-center justify-center border border-border/50 transition-all hover:shadow-sm hover:border-primary/20 group"
          >
            <Bell className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
            {notifDot && (
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-destructive animate-pulse" />
            )}
          </button>

          {/* Notification Tray */}
          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className="absolute top-12 right-0 w-72 glass-card border border-border/40 rounded-2xl shadow-elevated z-50 p-4 max-h-[400px] overflow-y-auto"
              >
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-border/40">
                  <h3 className="text-sm font-display font-bold text-foreground">Notifications</h3>
                  <button onClick={() => setNotifications([])} className="text-[10px] text-primary hover:underline font-bold uppercase tracking-wider">Clear All</button>
                </div>
                <div className="space-y-3">
                  {notifications.length > 0 ? (
                    notifications.map((n) => (
                      <div key={n.id} className={`p-3 rounded-xl border transition-all ${n.read ? "bg-muted/30 border-transparent" : "bg-primary/5 border-primary/10"}`}>
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="text-xs font-display font-bold text-foreground">{n.title}</h4>
                          <span className="text-[9px] text-muted-foreground font-body">{n.time}</span>
                        </div>
                        <p className="text-xs font-body text-muted-foreground leading-snug">{n.message}</p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <Bell className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
                      <p className="text-xs font-body text-muted-foreground">No new notifications</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="container mx-auto px-4 py-3 space-y-5"
      >
        {/* Quick Actions */}
        <motion.div variants={fadeUp} className="grid grid-cols-4 gap-2.5">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <motion.button
                key={action.path}
                whileTap={{ scale: 0.92 }}
                onClick={() => navigate(action.path)}
                className="flex flex-col items-center gap-2 p-3 rounded-2xl glass-card border border-white/30 card-hover-glow group shadow-card"
              >
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <span className="text-[11px] font-display font-semibold text-foreground">{action.label}</span>
              </motion.button>
            );
          })}
        </motion.div>

        {/* Krishi AI Insight */}
        <motion.div variants={fadeUp}>
          <KrishiInsight temp={weatherData.temp} condition={weatherData.condition} />
        </motion.div>

        {/* Weather Card */}
        <motion.div
          variants={fadeUp}
          onClick={() => navigate("/weather")}
          className="relative overflow-hidden rounded-2xl gradient-hero p-5 shadow-lg cursor-pointer group"
        >
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="w-14 h-14 rounded-2xl bg-primary-foreground/15 backdrop-blur-md border border-primary-foreground/15 flex items-center justify-center"
                >
                  {loadingWeather ? (
                    <div className="w-6 h-6 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  ) : (
                    <CloudSun className="w-8 h-8 text-primary-foreground" />
                  )}
                </motion.div>
                <div>
                  <h2 className="text-3xl font-display font-extrabold text-primary-foreground leading-none">{weatherData.temp}</h2>
                  <p className="text-xs font-body text-primary-foreground/70 mt-0.5">{weatherData.condition}</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-display font-bold px-2.5 py-1 rounded-full bg-primary-foreground/12 text-primary-foreground uppercase tracking-wider border border-primary-foreground/12 backdrop-blur-sm flex items-center gap-1">
                  <MapPin className="w-2.5 h-2.5" /> {userLocation}
                </span>
                <div className="flex items-center gap-1 mt-2 text-primary-foreground/50 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-[10px] font-display font-semibold">Details</span>
                  <ChevronRight className="w-3 h-3" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {[
                { icon: Droplets, label: t("weather.humidity"), value: weatherData.humidity },
                { icon: Wind, label: t("weather.windSpeed"), value: weatherData.wind },
                { icon: Sun, label: "UV Index", value: "Moderate" },
              ].map(({ icon: WIcon, label, value }) => (
                <div key={label} className="bg-primary-foreground/10 backdrop-blur-md rounded-xl p-2.5 border border-primary-foreground/10">
                  <p className="text-[9px] font-display font-semibold text-primary-foreground/50 mb-0.5 flex items-center gap-1">
                    <WIcon className="w-2.5 h-2.5" /> {label}
                  </p>
                  <p className="text-sm font-display font-bold text-primary-foreground">{value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="absolute -top-14 -right-14 w-48 h-48 bg-primary-foreground/6 rounded-full blur-3xl" />
          <div className="absolute -bottom-14 -left-14 w-48 h-48 bg-accent/12 rounded-full blur-3xl" />
        </motion.div>

        {/* Crop Season Progress */}
        <motion.div variants={fadeUp}>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-display font-bold text-foreground flex items-center gap-2">
              <Leaf className="w-4 h-4 text-primary" />
              Crop Progress
            </h2>
            <button onClick={() => navigate("/reports")} className="text-[10px] font-display font-bold text-primary hover:underline">View All</button>
          </div>
          <div className="space-y-2.5">
            {cropProgress.map((crop) => (
              <motion.div
                key={crop.name}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate("/reports")}
                className="glass-card border border-white/30 rounded-2xl p-4 cursor-pointer card-hover-glow shadow-card"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2.5">
                    <span className="text-lg">{crop.emoji}</span>
                    <div>
                      <p className="text-sm font-display font-bold text-foreground">{crop.name}</p>
                      <p className="text-[10px] font-body text-muted-foreground">{crop.stage}</p>
                    </div>
                  </div>
                  <span className="text-xs font-display font-bold text-primary">{crop.progress}%</span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${crop.progress}%` }}
                    transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
                    className="h-full rounded-full gradient-hero"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Market Trends */}
        <motion.div variants={fadeUp}>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-display font-bold text-foreground flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              {t("dash.marketTrends")}
            </h2>
            <button onClick={() => navigate("/market")} className="text-[10px] font-display font-bold text-primary hover:underline flex items-center gap-0.5">
              {t("dash.viewAll")} <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>

          <div className="glass-card border border-white/30 rounded-2xl overflow-hidden shadow-card">
            {crops.map((crop, i) => (
              <motion.div
                key={i}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate("/market")}
                className={`flex items-center justify-between p-4 cursor-pointer hover:bg-muted/30 transition-colors ${
                  i < crops.length - 1 ? "border-b border-border/30" : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                    crop.up ? "bg-primary/10" : "bg-destructive/10"
                  }`}>
                    {crop.up ? (
                      <TrendingUp className="w-4 h-4 text-primary" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-destructive" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-display font-bold text-foreground">{crop.name}</p>
                    <p className={`text-[10px] font-display font-bold ${crop.up ? "text-primary" : "text-destructive"}`}>
                      {crop.change}
                    </p>
                  </div>
                </div>
                <p className="text-base font-display font-bold text-foreground">{crop.price}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Alerts */}
        <motion.div variants={fadeUp}>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-display font-bold text-foreground flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-accent" />
              {t("dash.alerts")}
            </h2>
            <span className="px-2 py-0.5 rounded-full bg-accent/10 text-accent text-[10px] font-bold border border-accent/15">
              3 {t("dash.activeAlerts")}
            </span>
          </div>
          <div className="space-y-2">
            <AnimatePresence>
              {alerts.map((alert, i) => {
                const style = alertStyles[alert.type as keyof typeof alertStyles];
                return (
                  <motion.div
                    key={alert.id}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className={`rounded-xl p-3.5 pl-5 border relative overflow-hidden ${style.bg}`}
                  >
                    <div className={`absolute left-0 top-2 bottom-2 w-1 rounded-r-full ${style.strip}`} />
                    <div className="flex items-start gap-2.5">
                      <div className={`mt-0.5 p-1.5 rounded-lg ${style.text}`}>
                        {alert.type === "danger" ? <AlertTriangle className="w-3.5 h-3.5" /> : alert.type === "warning" ? <Bell className="w-3.5 h-3.5" /> : <Sprout className="w-3.5 h-3.5" />}
                      </div>
                      <p className={`text-xs font-body leading-relaxed flex-1 ${style.text}`}>{t(alert.textKey)}</p>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>

      <BottomNav />
    </div>
  );
};

export default Dashboard;

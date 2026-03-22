import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CloudSun, CloudRain, Sun, Cloud, Wind, Droplets, Thermometer, ArrowLeft, AlertTriangle } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

const Weather = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState("Bhubaneswar");
  const [currentWeather, setCurrentWeather] = useState({
    temp: "32°C",
    condition: t("weather.partlyCloudy"),
    humidity: "72%",
    wind: "12 km/h",
    feelsLike: "35°C",
    icon: CloudSun
  });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [forecast, setForecast] = useState<any[]>([]);
  const [aiAnalysis, setAiAnalysis] = useState("");
  const [analyzing, setAnalyzing] = useState(false);

  const getWeatherIcon = (code: number) => {
    if (code === 0) return Sun;
    if (code > 0 && code < 45) return CloudSun;
    if (code >= 45 && code < 60) return Cloud;
    if (code >= 60) return CloudRain;
    return CloudSun;
  };

  const getWeatherCondition = (code: number) => {
    if (code === 0) return t("weather.sunny");
    if (code > 0 && code < 45) return t("weather.partlyCloudy");
    if (code >= 45 && code < 60) return t("weather.cloudy");
    if (code >= 60) return t("weather.rainy");
    return t("weather.partlyCloudy");
  };

  useEffect(() => {
    const fetchFullWeather = async () => {
      try {
        const stored = localStorage.getItem("krishi-ai-profile");
        const profile = stored ? JSON.parse(stored) : null;
        const location = profile?.location || "Bhubaneswar";
        setUserLocation(location.split(",")[0]);

        const geoRes = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(location)}&format=json&limit=1`);
        const geoData = await geoRes.json();
        
        if (geoData && geoData[0]) {
          const { lat, lon } = geoData[0];
          const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,precipitation_probability_max&timezone=auto`);
          const data = await res.json();

          if (data && data.current) {
            setCurrentWeather({
              temp: `${Math.round(data.current.temperature_2m)}°C`,
              condition: getWeatherCondition(data.current.weather_code),
              humidity: `${data.current.relative_humidity_2m}%`,
              wind: `${Math.round(data.current.wind_speed_10m)} km/h`,
              feelsLike: `${Math.round(data.current.apparent_temperature)}°C`,
              icon: getWeatherIcon(data.current.weather_code)
            });

            const days = [t("weather.sun"), t("weather.mon"), t("weather.tue"), t("weather.wed"), t("weather.thu"), t("weather.fri"), t("weather.sat")];
            const formattedForecast = data.daily.time.map((time: string, i: number) => {
              const date = new Date(time);
              const dayName = i === 0 ? t("weather.today") : days[date.getDay()];
              return {
                day: dayName,
                icon: getWeatherIcon(data.daily.weather_code[i]),
                temp: `${Math.round(data.daily.temperature_2m_max[i])}°C`,
                condition: getWeatherCondition(data.daily.weather_code[i]),
                rain: `${data.daily.precipitation_probability_max[i]}%`
              };
            });
            setForecast(formattedForecast);
            
            // Trigger AI Analysis
            void fetchAIAnalysis(formattedForecast, location);
          }
        }
      } catch (err) {
        console.error("Full weather fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    void fetchFullWeather();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [t]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const fetchAIAnalysis = async (forecastData: any[], location: string) => {
    setAnalyzing(true);
    try {
      const forecastSummary = forecastData.map(d => `${d.day}: ${d.temp}, ${d.condition}, Rain: ${d.rain}`).join(" | ");
      const prompt = `You are a specialized agricultural weather analyst. Analyze this 7-day forecast for ${location}: ${forecastSummary}. 
      Provide a concise 2-3 sentence agricultural advisory focused on: 
      1. Best day for irrigation/spraying. 
      2. Risks (frost, heavy rain, or high heat). 
      3. A specific action for the farmer. 
      Keep it practical and helpful.`;

      const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3001";
      const res = await fetch(`${backendUrl}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: prompt })
      });
      const data = await res.json();
      if (data.text) setAiAnalysis(data.text);
    } catch (err) {
      console.error("AI Analysis failed:", err);
    } finally {
      setAnalyzing(false);
    }
  };

  const CurrentIcon = currentWeather.icon;

  const advisories = [];
  if (parseFloat(currentWeather.humidity) > 70) {
    advisories.push({ type: "danger", text: t("weather.advice.humidity"), icon: AlertTriangle });
  }
  if (forecast[0]?.rain && parseInt(forecast[0].rain) > 40) {
    advisories.push({ type: "warning", text: t("weather.advice.rain"), icon: CloudRain });
  }
  if (parseFloat(currentWeather.temp) > 20 && parseFloat(currentWeather.temp) < 35 && parseFloat(currentWeather.humidity) > 50) {
    advisories.push({ type: "info", text: t("weather.advice.rice"), icon: Droplets });
  }
  
  // Fallback if no specific conditions met
  if (advisories.length === 0) {
    advisories.push({ type: "info", text: "Conditions are stable. Continue regular crop monitoring.", icon: Sun });
  }

  return (
    <div className="min-h-screen bg-mesh pb-28">
      <div className="gradient-hero px-4 pt-6 pb-8 rounded-b-3xl shadow-lg">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate(-1)} className="p-2 rounded-xl hover:bg-white/10 transition-colors">
            <ArrowLeft className="w-5 h-5 text-primary-foreground" />
          </button>
          <h1 className="text-xl font-display font-bold text-primary-foreground">{t("weather.title")}</h1>
        </div>

        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
          {loading ? (
            <div className="w-20 h-20 border-4 border-secondary-foreground/30 border-t-secondary-foreground rounded-full animate-spin mx-auto mb-4" />
          ) : (
            <>
              <CurrentIcon className="w-20 h-20 text-primary-foreground mx-auto mb-2 animate-float" />
              <p className="text-5xl font-display font-extrabold text-primary-foreground">{currentWeather.temp}</p>
              <p className="font-body text-primary-foreground/90 mt-1">
                {currentWeather.condition} • {userLocation}
              </p>
              <div className="flex justify-center gap-6 mt-4 text-sm text-primary-foreground/90 font-body">
                <span className="flex items-center gap-1"><Droplets className="w-4 h-4" /> {currentWeather.humidity}</span>
                <span className="flex items-center gap-1"><Wind className="w-4 h-4" /> {currentWeather.wind}</span>
                <span className="flex items-center gap-1"><Thermometer className="w-4 h-4" /> {t("dash.feelsLike")} {currentWeather.feelsLike}</span>
              </div>
            </>
          )}
        </motion.div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <h2 className="font-display font-bold text-foreground mb-3">{t("weather.forecast")}</h2>
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
          {forecast.map((day, i) => {
            const Icon = day.icon;
            return (
              <motion.div
                key={day.day + i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`shrink-0 w-24 rounded-2xl p-4 text-center border shadow-card transition-all ${
                  i === 0 ? "glass-card border-primary/30 ring-2 ring-primary/20 scale-105 z-10" : "glass-card border-white/20"
                }`}
              >
                <p className="text-xs font-display font-semibold text-muted-foreground">{day.day}</p>
                <Icon className={`w-8 h-8 mx-auto my-2 ${i === 0 ? "text-primary" : "text-muted-foreground"}`} />
                <p className="font-display font-bold text-foreground">{day.temp}</p>
                <p className="text-xs font-body text-muted-foreground mt-1">Rain {day.rain}</p>
              </motion.div>
            )
          })}
        </div>

        <h2 className="font-display font-bold text-foreground mt-6 mb-3 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-primary" />
          AI Weather Analyst
        </h2>
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card border border-white/30 rounded-3xl p-6 mb-6 shadow-card"
        >
          {aiAnalysis || analyzing ? (
            <div className="space-y-3">
              <p className="text-sm font-body text-foreground leading-relaxed italic">
                "{aiAnalysis || "Our AI is currently processing the forecast to give you the best advice..."}"
              </p>
              <div className="flex items-center gap-2 pt-2 border-t border-primary/10">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="text-[10px] font-display font-bold text-primary uppercase tracking-tight">Personalized for {userLocation}</span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-4 gap-3 text-center">
              {analyzing ? (
                <>
                  <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                  <p className="text-xs font-body text-muted-foreground italic">Generating agricultural advisory...</p>
                </>
              ) : (
                <p className="text-xs font-body text-muted-foreground italic">Unable to generate AI analysis at this time.</p>
              )}
            </div>
          )}
        </motion.div>

        <h2 className="font-display font-bold text-foreground mb-3">AI {t("weather.advice")}</h2>
        <div className="space-y-3">
          {advisories.map((advisory, i) => {
            const Icon = advisory.icon;
            const colors = {
              warning: "bg-accent/10 border-accent/20",
              info: "bg-secondary/10 border-secondary/20",
              danger: "bg-destructive/10 border-destructive/20",
            };

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className={`rounded-xl p-4 border-2 flex gap-3 ${colors[advisory.type as keyof typeof colors]}`}
              >
                <Icon className="w-5 h-5 shrink-0 mt-0.5 text-foreground" />
                <p className="text-sm font-body text-foreground">{advisory.text}</p>
              </motion.div>
            );
          })}
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Weather;

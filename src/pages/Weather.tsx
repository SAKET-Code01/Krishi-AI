import { motion } from "framer-motion";
import { CloudSun, CloudRain, Sun, Cloud, Wind, Droplets, Thermometer, ArrowLeft, AlertTriangle } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

const Weather = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const forecast = [
    { day: t("weather.today"), icon: CloudSun, temp: "32°C", condition: t("weather.partlyCloudy"), rain: "10%" },
    { day: t("weather.tue"), icon: Sun, temp: "34°C", condition: t("weather.sunny"), rain: "0%" },
    { day: t("weather.wed"), icon: CloudRain, temp: "28°C", condition: t("weather.heavyRain"), rain: "85%" },
    { day: t("weather.thu"), icon: CloudRain, temp: "26°C", condition: t("weather.rainy"), rain: "70%" },
    { day: t("weather.fri"), icon: Cloud, temp: "29°C", condition: t("weather.cloudy"), rain: "30%" },
    { day: t("weather.sat"), icon: Sun, temp: "33°C", condition: t("weather.sunny"), rain: "5%" },
    { day: t("weather.sun"), icon: CloudSun, temp: "31°C", condition: t("weather.partlyCloudy"), rain: "15%" },
  ];

  const advisories = [
    { type: "warning", text: t("weather.advice.rain"), icon: CloudRain },
    { type: "info", text: t("weather.advice.rice"), icon: Droplets },
    { type: "danger", text: t("weather.advice.humidity"), icon: AlertTriangle },
  ];

  return (
    <div className="min-h-screen bg-background pb-28">
      <div className="bg-secondary px-4 pt-6 pb-8 rounded-b-3xl">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate(-1)} className="p-2 rounded-xl hover:bg-secondary-foreground/10">
            <ArrowLeft className="w-5 h-5 text-secondary-foreground" />
          </button>
          <h1 className="text-xl font-display font-bold text-secondary-foreground">{t("weather.title")}</h1>
        </div>

        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
          <CloudSun className="w-20 h-20 text-secondary-foreground mx-auto mb-2 animate-float" />
          <p className="text-5xl font-display font-extrabold text-secondary-foreground">32°C</p>
          <p className="font-body text-secondary-foreground/80 mt-1">
            {t("weather.partlyCloudy")} • {t("weather.location")}
          </p>
          <div className="flex justify-center gap-6 mt-4 text-sm text-secondary-foreground/80 font-body">
            <span className="flex items-center gap-1"><Droplets className="w-4 h-4" /> 72%</span>
            <span className="flex items-center gap-1"><Wind className="w-4 h-4" /> 12 km/h</span>
            <span className="flex items-center gap-1"><Thermometer className="w-4 h-4" /> {t("dash.feelsLike")} 35°C</span>
          </div>
        </motion.div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <h2 className="font-display font-bold text-foreground mb-3">{t("weather.forecast")}</h2>
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
          {forecast.map((day, i) => {
            const Icon = day.icon;
            return (
              <motion.div
                key={day.day}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`shrink-0 w-24 rounded-xl p-3 text-center border-2 ${
                  i === 0 ? "bg-primary/5 border-primary/20" : "bg-card border-border"
                }`}
              >
                <p className="text-xs font-display font-semibold text-muted-foreground">{day.day}</p>
                <Icon className={`w-8 h-8 mx-auto my-2 ${i === 0 ? "text-primary" : "text-muted-foreground"}`} />
                <p className="font-display font-bold text-foreground">{day.temp}</p>
                <p className="text-xs font-body text-muted-foreground mt-1">Rain {day.rain}</p>
              </motion.div>
            );
          })}
        </div>

        <h2 className="font-display font-bold text-foreground mt-6 mb-3">AI {t("weather.advice")}</h2>
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

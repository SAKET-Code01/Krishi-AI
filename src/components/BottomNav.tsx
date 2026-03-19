import { Home, Stethoscope, TrendingUp, User, Mic } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

const navItems = [
  { icon: Home, labelKey: "nav.home", path: "/dashboard" },
  { icon: Stethoscope, labelKey: "nav.cropDoc", path: "/crop-doctor" },
  { icon: Mic, labelKey: "nav.voiceAI", path: "/voice-assistant", isCenter: true },
  { icon: TrendingUp, labelKey: "nav.market", path: "/market" },
  { icon: User, labelKey: "profile.title", path: "/profile" },
];

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t-2 border-border pb-safe">
      <div className="flex items-end justify-around px-2 pt-2 pb-3 max-w-lg mx-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          if (item.isCenter) {
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="relative -mt-6"
              >
                <motion.div
                  whileTap={{ scale: 0.9 }}
                  className="w-16 h-16 rounded-full gradient-hero flex items-center justify-center animate-pulse-glow"
                >
                  <Icon className="w-7 h-7 text-primary-foreground" />
                </motion.div>
                <span className="text-xs font-display font-semibold text-primary block text-center mt-1">
                  {t(item.labelKey)}
                </span>
              </button>
            );
          }

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="flex flex-col items-center gap-1 min-w-[56px]"
            >
              <div className={`p-2 rounded-xl transition-colors ${isActive ? "bg-primary/10" : ""}`}>
                <Icon
                  className={`w-5 h-5 transition-colors ${isActive ? "text-primary" : "text-muted-foreground"}`}
                />
              </div>
              <span
                className={`text-xs font-display font-medium transition-colors ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {t(item.labelKey)}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;

import { Home, FileText, ShoppingCart, User, MessageSquare } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

const navItems = [
  { icon: Home, labelKey: "nav.home", path: "/dashboard" },
  { icon: FileText, labelKey: "schemes.title", path: "/schemes" },
  { icon: MessageSquare, labelKey: "aiChat.title", path: "/ai-chat", isCenter: true },
  { icon: ShoppingCart, labelKey: "nav.market", path: "/market" },
  { icon: User, labelKey: "profile.title", path: "/profile" },
];

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass-nav pb-safe">
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
                  className="w-16 h-16 rounded-full gradient-hero flex items-center justify-center shadow-lg animate-gentle-ring"
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
              className="flex flex-col items-center gap-1 min-w-[56px] group"
            >
              <motion.div
                animate={isActive ? { scale: 1.1 } : { scale: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                className={`p-2 rounded-xl transition-all duration-200 ${
                  isActive
                    ? "bg-primary/12 shadow-sm"
                    : "group-hover:bg-muted/60"
                }`}
              >
                <Icon
                  className={`w-5 h-5 transition-colors duration-200 ${
                    isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                  }`}
                />
              </motion.div>
              <span
                className={`text-[11px] font-display font-medium transition-colors duration-200 ${
                  isActive ? "text-primary font-semibold" : "text-muted-foreground"
                }`}
              >
                {t(item.labelKey)}
              </span>
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="w-1 h-1 rounded-full bg-primary"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;

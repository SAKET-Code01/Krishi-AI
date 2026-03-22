import { motion } from "framer-motion";
import { LucideIcon, ArrowUpRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  path: string;
  gradient?: boolean;
}

const FeatureCard = ({ icon: Icon, title, description, path, gradient }: FeatureCardProps) => {
  const navigate = useNavigate();

  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      onClick={() => navigate(path)}
      className={`rounded-2xl p-4 md:p-6 cursor-pointer shimmer-on-hover card-hover-glow transition-all duration-300 group ${
        gradient
          ? "gradient-hero text-primary-foreground shadow-lg"
          : "glass-card border border-white/30 hover:border-primary/30 shadow-card"
      }`}
    >
      <div className="flex items-start justify-between mb-3 md:mb-4">
        <div
          className={`w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 ${
            gradient
              ? "bg-primary-foreground/20"
              : "bg-primary/10 group-hover:bg-primary/15"
          }`}
        >
          <Icon className={`w-5 h-5 md:w-6 md:h-6 ${gradient ? "text-primary-foreground" : "text-primary"}`} />
        </div>
        <div
          className={`w-7 h-7 md:w-8 md:h-8 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-1 group-hover:translate-x-0 hidden sm:flex ${
            gradient
              ? "bg-primary-foreground/15"
              : "bg-primary/8"
          }`}
        >
          <ArrowUpRight className={`w-3.5 h-3.5 md:w-4 md:h-4 ${gradient ? "text-primary-foreground" : "text-primary"}`} />
        </div>
      </div>
      <h3 className={`text-sm md:text-base font-display font-bold mb-1 md:mb-1.5 leading-tight ${gradient ? "" : "text-foreground"}`}>
        {title}
      </h3>
      <p className={`text-xs md:text-sm font-body leading-relaxed line-clamp-2 ${gradient ? "opacity-85" : "text-muted-foreground"}`}>
        {description}
      </p>
    </motion.div>
  );
};

export default FeatureCard;

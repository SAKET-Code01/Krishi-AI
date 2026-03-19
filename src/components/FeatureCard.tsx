import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
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
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.97 }}
      onClick={() => navigate(path)}
      className={`rounded-2xl p-8 cursor-pointer shadow-card transition-shadow hover:shadow-elevated ${
        gradient
          ? "gradient-hero text-primary-foreground"
          : "bg-card border-2 border-border"
      }`}
    >
      <div
        className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
          gradient ? "bg-primary-foreground/20" : "bg-primary/10"
        }`}
      >
        <Icon className={`w-6 h-6 ${gradient ? "text-primary-foreground" : "text-primary"}`} />
      </div>
      <h3 className={`text-lg font-display font-bold mb-2 ${gradient ? "" : "text-foreground"}`}>
        {title}
      </h3>
      <p className={`text-sm font-body leading-relaxed ${gradient ? "opacity-90" : "text-muted-foreground"}`}>
        {description}
      </p>
    </motion.div>
  );
};

export default FeatureCard;

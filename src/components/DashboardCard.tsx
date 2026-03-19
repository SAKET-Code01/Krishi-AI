import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface DashboardCardProps {
  icon: LucideIcon;
  title: string;
  value: string;
  subtitle?: string;
  variant?: "default" | "primary" | "secondary" | "accent";
  onClick?: () => void;
}

const variantStyles = {
  default: "bg-card border-2 border-border",
  primary: "bg-primary/5 border-2 border-primary/20",
  secondary: "bg-secondary/5 border-2 border-secondary/20",
  accent: "bg-accent/10 border-2 border-accent/30",
};

const iconStyles = {
  default: "bg-muted text-foreground",
  primary: "bg-primary/10 text-primary",
  secondary: "bg-secondary/10 text-secondary",
  accent: "bg-accent/20 text-accent",
};

const DashboardCard = ({
  icon: Icon,
  title,
  value,
  subtitle,
  variant = "default",
  onClick,
}: DashboardCardProps) => {
  return (
    <motion.div
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={`rounded-xl p-4 shadow-card cursor-pointer ${variantStyles[variant]}`}
    >
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${iconStyles[variant]}`}>
        <Icon className="w-5 h-5" />
      </div>
      <p className="text-sm font-body text-muted-foreground">{title}</p>
      <p className="text-xl font-display font-bold text-foreground mt-1">{value}</p>
      {subtitle && (
        <p className="text-xs font-body text-muted-foreground mt-1">{subtitle}</p>
      )}
    </motion.div>
  );
};

export default DashboardCard;

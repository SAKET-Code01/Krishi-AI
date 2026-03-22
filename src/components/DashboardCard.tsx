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
  default: "glass-card border border-amber-900/10 shadow-card",
  primary: "bg-primary/5 border border-primary/15",
  secondary: "bg-secondary/5 border border-secondary/15",
  accent: "bg-accent/8 border border-accent/20",
};

const iconStyles = {
  default: "bg-muted text-foreground",
  primary: "bg-primary/12 text-primary",
  secondary: "bg-secondary/12 text-secondary",
  accent: "bg-accent/15 text-accent",
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
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={`rounded-xl p-4 cursor-pointer card-hover-glow transition-all duration-200 group ${variantStyles[variant]}`}
    >
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-transform duration-200 group-hover:scale-110 ${iconStyles[variant]}`}>
        <Icon className="w-5 h-5" />
      </div>
      <p className="text-xs font-display font-medium text-muted-foreground uppercase tracking-wide">{title}</p>
      <p className="text-xl font-display font-bold text-foreground mt-0.5">{value}</p>
      {subtitle && (
        <p className="text-[11px] font-body text-muted-foreground mt-1">{subtitle}</p>
      )}
    </motion.div>
  );
};

export default DashboardCard;

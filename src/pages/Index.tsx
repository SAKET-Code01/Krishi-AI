import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Stethoscope,
  CloudSun,
  TrendingUp,
  Briefcase,
  Mic,
  MapPin,
  FileText,
  ArrowRight,
  Leaf,
  Users,
  Sparkles,
  Shield,
  MessageSquare,
} from "lucide-react";
import heroImage from "@/assets/hero-farming.jpg";
import logo from "@/assets/krishi-logo.png";
import FeatureCard from "@/components/FeatureCard";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useLanguage } from "@/contexts/LanguageContext";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const Index = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const features = [
    { icon: MessageSquare, title: t("feat.voiceAI"), description: t("feat.voiceAI.desc"), path: "/ai-chat", gradient: true },
    { icon: Stethoscope, title: t("feat.cropDoc"), description: t("feat.cropDoc.desc"), path: "/crop-doctor" },
    { icon: CloudSun, title: t("feat.weather"), description: t("feat.weather.desc"), path: "/weather" },
    { icon: TrendingUp, title: t("feat.market"), description: t("feat.market.desc"), path: "/market" },
    { icon: Briefcase, title: t("feat.jobs"), description: t("feat.jobs.desc"), path: "/jobs" },
    { icon: MapPin, title: t("feat.land"), description: t("feat.land.desc"), path: "/land" },
    { icon: Leaf, title: t("feat.cropPlanner"), description: t("feat.cropPlanner.desc"), path: "/reports" },
    { icon: FileText, title: t("feat.schemes"), description: t("feat.schemes.desc"), path: "/schemes" },
  ];

  const stats = [
    { icon: Users, value: "50K+", label: "Active Farmers" },
    { icon: Sparkles, value: "94%", label: "AI Accuracy" },
    { icon: Shield, value: "100%", label: "Free to Use" },
  ];

  return (
    <div className="min-h-screen bg-mesh">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImage} alt="Smart farming with AI technology" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-foreground/75 via-foreground/55 to-background" />
        </div>

        <div className="relative z-10 container mx-auto px-4 pt-4 pb-24">
          {/* Navbar — mobile-first responsive */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="sticky top-4 z-50 flex items-center justify-between gap-2 mb-10 md:mb-16 p-3 md:p-4 rounded-2xl bg-background/15 backdrop-blur-xl border border-primary-foreground/10 shadow-xl"
          >
            <div className="flex items-center gap-2 shrink-0">
              <motion.img
                whileHover={{ rotate: 15, scale: 1.1 }}
                src={logo} alt="Krishi AI" className="w-8 h-8 md:w-10 md:h-10 transition-transform"
              />
              <span className="font-display font-bold text-base md:text-xl text-primary-foreground hidden sm:inline">Krishi AI</span>
            </div>
            <div className="flex items-center gap-1.5 md:gap-2 flex-shrink-0">
              <LanguageSwitcher />
              <button
                onClick={() => navigate("/login")}
                className="hidden sm:block px-4 py-2 rounded-xl bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 text-primary-foreground font-display font-semibold text-xs md:text-sm hover:bg-primary-foreground/20 transition-all duration-200"
              >
                Login
              </button>
              <button
                onClick={() => navigate("/dashboard")}
                className="px-3 md:px-5 py-2 md:py-2.5 rounded-xl bg-primary text-primary-foreground font-display font-semibold text-xs md:text-sm hover:brightness-110 transition-all duration-200 shadow-md whitespace-nowrap"
              >
                {t("hero.dashboard")}
              </button>
            </div>
          </motion.div>

          {/* Hero content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-full bg-primary/20 border border-primary/30 mb-6 md:mb-8 backdrop-blur-sm">
              <Leaf className="w-3.5 h-3.5 md:w-4 md:h-4 text-primary" />
              <span className="text-xs md:text-sm font-display font-semibold text-primary">{t("hero.badge")}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-display font-extrabold text-primary-foreground leading-[1.1] mb-4 md:mb-5 drop-shadow-lg">
              {t("hero.title1")} <span className="text-gradient">{t("hero.title2")}</span>
            </h1>
            <p className="text-base md:text-xl text-primary-foreground/90 font-body font-medium leading-relaxed mb-8 md:mb-10 max-w-lg drop-shadow-sm">
              {t("hero.desc")}
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/login")}
                className="flex items-center justify-center gap-2.5 px-6 md:px-7 py-3.5 md:py-4 rounded-xl gradient-hero text-primary-foreground font-display font-bold text-sm md:text-base shadow-lg hover:shadow-xl transition-shadow"
              >
                <MessageSquare className="w-5 h-5" />
                {t("hero.talkBtn")}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/login")}
                className="flex items-center justify-center gap-2.5 px-6 md:px-7 py-3.5 md:py-4 rounded-xl bg-white/15 backdrop-blur-md border-2 border-white/25 text-primary-foreground font-display font-bold text-sm md:text-base hover:bg-white/25 transition-all duration-300 shadow-lg"
              >
                {t("hero.exploreBtn")}
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="container mx-auto px-4 -mt-10 relative z-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card rounded-2xl p-4 md:p-6 grid grid-cols-3 gap-3 md:gap-6"
        >
          {stats.map(({ icon: Icon, value, label }) => (
            <div key={label} className="text-center">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-1.5 md:mb-2">
                <Icon className="w-4 h-4 md:w-5 md:h-5 text-primary" />
              </div>
              <p className="text-lg md:text-2xl font-display font-extrabold text-foreground">{value}</p>
              <p className="text-[10px] md:text-xs font-body text-muted-foreground mt-0.5">{label}</p>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-12 md:py-16">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-8 md:mb-12"
        >
          <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-2 md:mb-3">{t("features.title")}</h2>
          <p className="text-muted-foreground font-body text-sm md:text-lg max-w-md mx-auto">{t("features.subtitle")}</p>
          <div className="w-12 md:w-16 h-1 rounded-full gradient-hero mx-auto mt-3 md:mt-4" />
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5"
        >
          {features.map((f) => (
            <motion.div key={f.path} variants={item}>
              <FeatureCard {...f} />
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 pb-12 md:pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl md:rounded-3xl gradient-hero p-6 md:p-14 text-center relative overflow-hidden"
        >
          <div className="absolute -top-20 -right-20 w-40 md:w-60 h-40 md:h-60 bg-primary-foreground/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-40 md:w-60 h-40 md:h-60 bg-accent/15 rounded-full blur-3xl" />
          <div className="relative z-10">
            <h2 className="text-xl md:text-3xl font-display font-bold text-primary-foreground mb-3 md:mb-4">{t("cta.title")}</h2>
            <p className="text-primary-foreground/80 font-body text-sm md:text-base mb-6 md:mb-8 max-w-md mx-auto">{t("cta.desc")}</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/login")}
              className="px-8 md:px-10 py-3.5 md:py-4 rounded-xl bg-primary-foreground text-primary font-display font-bold text-sm md:text-base hover:shadow-xl transition-all duration-300"
            >
              {t("cta.btn")}
            </motion.button>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default Index;

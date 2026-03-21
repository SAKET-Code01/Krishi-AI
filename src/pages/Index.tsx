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
} from "lucide-react";
import heroImage from "@/assets/hero-farming.jpg";
import logo from "@/assets/krishi-logo.png";
import FeatureCard from "@/components/FeatureCard";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useLanguage } from "@/contexts/LanguageContext";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const Index = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const features = [
    { icon: Mic, title: t("feat.voiceAI"), description: t("feat.voiceAI.desc"), path: "/voice-assistant", gradient: true },
    { icon: Stethoscope, title: t("feat.cropDoc"), description: t("feat.cropDoc.desc"), path: "/crop-doctor" },
    { icon: CloudSun, title: t("feat.weather"), description: t("feat.weather.desc"), path: "/weather" },
    { icon: TrendingUp, title: t("feat.market"), description: t("feat.market.desc"), path: "/market" },
    { icon: Briefcase, title: t("feat.jobs"), description: t("feat.jobs.desc"), path: "/jobs" },
    { icon: MapPin, title: t("feat.land"), description: t("feat.land.desc"), path: "/land" },
    { icon: Leaf, title: t("feat.cropPlanner"), description: t("feat.cropPlanner.desc"), path: "/reports" },
    { icon: FileText, title: t("feat.schemes"), description: t("feat.schemes.desc"), path: "/schemes" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImage} alt="Smart farming with AI technology" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-foreground/70 via-foreground/50 to-background" />
        </div>

        <div className="relative z-10 container mx-auto px-4 pt-4 pb-20">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="sticky top-4 z-50 flex items-center justify-between mb-16 p-4 rounded-2xl bg-background/20 backdrop-blur-md border border-primary-foreground/10 shadow-lg"
          >
            <div className="flex items-center gap-2 group cursor-pointer">
              <motion.img
                whileHover={{ rotate: 15, scale: 1.1 }}
                src={logo} alt="Krishi AI" className="w-10 h-10 transition-transform"
              />
              <span className="font-display font-bold text-xl text-primary-foreground group-hover:text-primary transition-colors">Krishi AI</span>
            </div>
            <div className="flex items-center gap-2">
              <LanguageSwitcher />
              <button
                onClick={() => navigate("/login")}
                className="px-5 py-2.5 rounded-xl bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 text-primary-foreground font-display font-semibold text-sm hover:bg-primary-foreground/20 transition-colors"
              >
                Login
              </button>
              <button
                onClick={() => navigate("/dashboard")}
                className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-display font-semibold text-sm hover:opacity-90 transition-opacity"
              >
                {t("hero.dashboard")}
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/20 border border-primary/30 mb-8 backdrop-blur-sm">
              <Leaf className="w-4 h-4 text-primary animate-bounce-slow" />
              <span className="text-sm font-display font-semibold text-primary">{t("hero.badge")}</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-display font-extrabold text-primary-foreground leading-tight mb-4 drop-shadow-md">
              {t("hero.title1")} <span className="text-primary">{t("hero.title2")}</span>
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground font-display font-bold leading-relaxed mb-8 max-w-lg drop-shadow-sm">
              {t("hero.desc")}
            </p>
            <div className="flex flex-wrap gap-3">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/voice-assistant")}
                className="flex items-center gap-2 px-6 py-3.5 rounded-xl gradient-hero text-primary-foreground font-display font-bold text-base animate-pulse-glow"
              >
                <Mic className="w-5 h-5" />
                {t("hero.talkBtn")}
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/profile")}
                className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white/20 backdrop-blur-md border-2 border-white/30 text-primary-foreground font-display font-bold text-base hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300 shadow-lg"
              >
                {t("hero.exploreBtn")}
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-display font-bold text-foreground mb-3">{t("features.title")}</h2>
          <p className="text-muted-foreground font-body text-lg max-w-md mx-auto">{t("features.subtitle")}</p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {features.map((f) => (
            <motion.div key={f.path} variants={item}>
              <FeatureCard {...f} />
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl gradient-hero p-8 md:p-12 text-center"
        >
          <h2 className="text-2xl md:text-3xl font-display font-bold text-primary-foreground mb-3">{t("cta.title")}</h2>
          <p className="text-primary-foreground/80 font-body mb-6 max-w-md mx-auto">{t("cta.desc")}</p>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/profile")}
            className="px-8 py-3.5 rounded-xl bg-primary-foreground text-primary font-display font-bold text-base hover:opacity-90 transition-opacity"
          >
            {t("cta.btn")}
          </motion.button>
        </motion.div>
      </section>
    </div>
  );
};

export default Index;

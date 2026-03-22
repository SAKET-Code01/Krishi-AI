import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Leaf,
  Phone,
  ArrowRight,
  ChevronRight,
  Shield,
  Sparkles,
  Users,
} from "lucide-react";
import heroImage from "@/assets/hero-farming.jpg";
import logo from "@/assets/krishi-logo.png";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useLanguage } from "@/contexts/LanguageContext";

const OTP_LENGTH = 6;

type Step = "phone" | "otp";

const Login = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [phoneError, setPhoneError] = useState("");

  const isValidPhone = /^[6-9]\d{9}$/.test(phone);

  const handleSendOtp = () => {
    if (!isValidPhone) {
      setPhoneError(t("login.phoneError"));
      return;
    }
    setPhoneError("");
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep("otp");
    }, 1200);
  };

  const handleVerifyOtp = () => {
    if (otp.length < OTP_LENGTH) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      localStorage.setItem("userType", "authenticated");
      navigate("/profile");
    }, 1000);
  };

  const handleGuest = () => {
    localStorage.setItem("userType", "guest");
    navigate("/profile");
  };

  const stats = [
    { icon: Users, label: t("login.stat.farmers"), value: "50K+" },
    { icon: Sparkles, label: t("login.stat.accuracy"), value: "94%" },
    { icon: Shield, label: t("login.stat.free"), value: "100%" },
  ];

  return (
    <div className="min-h-screen flex">
      {/* ─── LEFT PANEL — hero image ─── */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img
          src={heroImage}
          alt="Smart farming fields"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/85 via-primary/60 to-secondary/70" />

        {/* content over image */}
        <div className="relative z-10 flex flex-col justify-between p-10 w-full">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <motion.img
              whileHover={{ rotate: 15, scale: 1.1 }}
              src={logo}
              alt="Krishi AI"
              className="w-12 h-12"
            />
            <span className="font-display font-bold text-2xl text-white">
              Krishi AI
            </span>
          </motion.div>

          {/* Centre copy */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 border border-white/30 mb-6 backdrop-blur-sm">
              <Leaf className="w-4 h-4 text-white animate-bounce-slow" />
              <span className="text-sm font-display font-semibold text-white">
                {t("hero.badge")}
              </span>
            </div>
            <h1 className="text-4xl xl:text-5xl font-display font-extrabold text-white leading-tight mb-4">
              {t("login.heroTitle1")}{" "}
              <span className="text-white/80">{t("login.heroTitle2")}</span>
            </h1>
            <p className="text-white/80 font-body text-lg leading-relaxed max-w-md">
              {t("login.heroDesc")}
            </p>

            {/* Stats row */}
            <div className="flex gap-6 mt-10">
              {stats.map(({ icon: Icon, label, value }) => (
                <div key={label} className="text-white">
                  <div className="flex items-center gap-1.5 mb-1">
                    <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-2xl font-display font-bold">
                      {value}
                    </span>
                  </div>
                  <p className="text-sm text-white/70 font-body">{label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Decorative floating card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-4 inline-flex items-center gap-3 self-start"
          >
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-white font-display font-semibold text-sm">
                {t("login.card.title")}
              </p>
              <p className="text-white/70 font-body text-xs">
                {t("login.card.sub")}
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ─── RIGHT PANEL — form ─── */}
      <div className="flex-1 relative flex flex-col min-h-screen bg-background overflow-hidden">
        {/* Mobile background */}
        <div className="lg:hidden absolute inset-0">
          <img
            src={heroImage}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-primary/80 via-primary/50 to-background" />
        </div>

        {/* Top bar */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 flex items-center justify-between px-6 pt-6"
        >
          {/* Mobile logo */}
          <div className="flex items-center gap-2 lg:invisible">
            <img src={logo} alt="Krishi AI" className="w-8 h-8" />
            <span className="font-display font-bold text-lg text-white lg:text-foreground">
              Krishi AI
            </span>
          </div>
          <div className="ml-auto">
            <LanguageSwitcher />
          </div>
        </motion.div>

        {/* Form container */}
        <div className="relative z-10 flex-1 flex items-center justify-center px-6 py-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="w-full max-w-md"
          >
            {/* Card */}
            <div className="glass-card rounded-3xl shadow-elevated border border-white/30 p-8">
              {/* Header */}
              <div className="mb-8">
                <h2 className="text-2xl font-display font-extrabold text-foreground mb-1">
                  {t("login.title")}
                </h2>
                <p className="text-muted-foreground font-body text-sm">
                  {t("login.subtitle")}
                </p>
              </div>

              <AnimatePresence mode="wait">
                {step === "phone" ? (
                  <motion.div
                    key="phone-step"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-5"
                  >
                    {/* Phone input */}
                    <div>
                      <label className="block text-sm font-display font-semibold text-foreground mb-2">
                        {t("login.phone")}
                      </label>
                      <div
                        className={`flex items-center gap-3 px-4 py-3.5 rounded-xl border-2 bg-background transition-colors ${
                          phoneError
                            ? "border-destructive"
                            : "border-input focus-within:border-primary"
                        }`}
                      >
                        <div className="flex items-center gap-2 shrink-0 pr-3 border-r border-border">
                          <span className="text-lg">🇮🇳</span>
                          <span className="text-sm font-display font-semibold text-foreground">
                            +91
                          </span>
                        </div>
                        <Phone className="w-4 h-4 text-muted-foreground shrink-0" />
                        <input
                          id="phone-input"
                          type="tel"
                          inputMode="numeric"
                          maxLength={10}
                          value={phone}
                          onChange={(e) => {
                            setPhone(e.target.value.replace(/\D/g, ""));
                            setPhoneError("");
                          }}
                          placeholder={t("login.phonePlaceholder")}
                          className="flex-1 bg-transparent outline-none text-sm font-body text-foreground placeholder:text-muted-foreground"
                        />
                      </div>
                      {phoneError && (
                        <p className="text-destructive text-xs font-body mt-1.5">
                          {phoneError}
                        </p>
                      )}
                    </div>

                    {/* Send OTP button */}
                    <motion.button
                      id="send-otp-btn"
                      whileTap={{ scale: 0.97 }}
                      onClick={handleSendOtp}
                      disabled={loading}
                      className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl gradient-hero text-primary-foreground font-display font-bold text-sm hover:opacity-90 transition-opacity disabled:opacity-70 animate-pulse-glow"
                    >
                      {loading ? (
                        <span className="flex items-center gap-2">
                          <span className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                          {t("login.sending")}
                        </span>
                      ) : (
                        <>
                          {t("login.sendOtp")}
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </motion.button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="otp-step"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-5"
                  >
                    {/* OTP sent info */}
                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-primary/8 border border-primary/20">
                      <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
                        <Phone className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs font-body text-muted-foreground">
                          {t("login.otpSentTo")}
                        </p>
                        <p className="text-sm font-display font-bold text-foreground">
                          +91 {phone}
                        </p>
                      </div>
                      <button
                        onClick={() => setStep("phone")}
                        className="ml-auto text-xs text-primary font-display font-semibold hover:underline"
                      >
                        {t("login.change")}
                      </button>
                    </div>

                    {/* OTP boxes */}
                    <div>
                      <label className="block text-sm font-display font-semibold text-foreground mb-3">
                        {t("login.otp")}
                      </label>
                      <div className="flex gap-2 justify-between">
                        {Array.from({ length: OTP_LENGTH }).map((_, i) => (
                          <input
                            key={i}
                            id={`otp-box-${i}`}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={otp[i] || ""}
                            onChange={(e) => {
                              const val = e.target.value.replace(/\D/g, "");
                              const newOtp = otp.split("");
                              newOtp[i] = val;
                              const joined = newOtp.join("").slice(0, OTP_LENGTH);
                              setOtp(joined);
                              // auto-focus next
                              if (val && i < OTP_LENGTH - 1) {
                                const next = document.getElementById(
                                  `otp-box-${i + 1}`
                                ) as HTMLInputElement | null;
                                next?.focus();
                              }
                            }}
                            onKeyDown={(e) => {
                              if (e.key === "Backspace" && !otp[i] && i > 0) {
                                const prev = document.getElementById(
                                  `otp-box-${i - 1}`
                                ) as HTMLInputElement | null;
                                prev?.focus();
                                const newOtp = otp.split("");
                                newOtp[i - 1] = "";
                                setOtp(newOtp.join(""));
                              }
                            }}
                            className={`w-11 h-12 text-center text-lg font-display font-bold rounded-xl border-2 bg-background outline-none transition-colors focus:border-primary ${
                              otp[i]
                                ? "border-primary text-primary"
                                : "border-input text-foreground"
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Verify button */}
                    <motion.button
                      id="verify-otp-btn"
                      whileTap={{ scale: 0.97 }}
                      onClick={handleVerifyOtp}
                      disabled={otp.length < OTP_LENGTH || loading}
                      className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl gradient-hero text-primary-foreground font-display font-bold text-sm hover:opacity-90 transition-all disabled:opacity-50"
                    >
                      {loading ? (
                        <span className="flex items-center gap-2">
                          <span className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                          {t("login.verifying")}
                        </span>
                      ) : (
                        <>
                          {t("login.verify")}
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </motion.button>

                    {/* Resend */}
                    <p className="text-center text-xs font-body text-muted-foreground">
                      {t("login.noOtp")}{" "}
                      <button
                        onClick={() => {
                          setOtp("");
                          setStep("phone");
                        }}
                        className="text-primary font-semibold hover:underline"
                      >
                        {t("login.resend")}
                      </button>
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Divider */}
              <div className="flex items-center gap-3 my-6">
                <div className="flex-1 h-px bg-border" />
                <span className="text-xs font-body text-muted-foreground">
                  {t("login.or")}
                </span>
                <div className="flex-1 h-px bg-border" />
              </div>

              {/* Guest */}
              <motion.button
                id="guest-btn"
                whileTap={{ scale: 0.97 }}
                onClick={handleGuest}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-border bg-background text-foreground font-display font-semibold text-sm hover:border-primary hover:text-primary transition-colors"
              >
                {t("login.guest")}
                <ChevronRight className="w-4 h-4" />
              </motion.button>

              {/* Terms */}
              <p className="text-center text-xs font-body text-muted-foreground mt-6 leading-relaxed">
                {t("login.terms")}
              </p>
            </div>

            {/* Back to home */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              onClick={() => navigate("/")}
              className="mt-6 mx-auto flex items-center gap-1 text-sm font-body text-muted-foreground hover:text-foreground transition-colors lg:text-foreground"
            >
              ← {t("login.backHome")}
            </motion.button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Login;

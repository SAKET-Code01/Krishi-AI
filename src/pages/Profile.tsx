import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, User, MapPin, Ruler, Sprout, Award, Save, Check, X, Phone, Layers, Droplets } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import BottomNav from "@/components/BottomNav";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "@/hooks/use-toast";

const soilTypeKeys = ["alluvial", "black", "red", "laterite", "arid", "other"];
const irrigationKeys = ["rainfed", "tubewell", "drip", "sprinkler", "canal"];
const irrigationValues = ["Rainfed", "Tube Well", "Drip", "Sprinkler", "Canal"];
const soilValues = ["Alluvial", "Black", "Red", "Laterite", "Arid", "Other"];

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

const Profile = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [saved, setSaved] = useState(false);

  const [form, setForm] = useState<{
    name: string;
    location: string;
    phone: string;
    landSize: string;
    experience: string;
    crops: string[];
    soil: string;
    irrigation: string;
  }>(() => {
    const stored = localStorage.getItem("krishi-ai-profile");
    let initialForm = {
      name: "",
      location: "",
      phone: "",
      landSize: "",
      experience: "beginner",
      crops: [],
      soil: "",
      irrigation: "",
    };
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (typeof parsed.crops === 'string') {
          parsed.crops = parsed.crops.split(',').map((c: string) => c.trim()).filter(Boolean);
        }
        delete parsed.weather;
        initialForm = { ...initialForm, ...parsed };
      } catch (e) {
        console.error("Failed to parse profile JSON", e);
      }
    }
    return initialForm;
  });

  const [cropInput, setCropInput] = useState("");
  const [locationSuggestions, setLocationSuggestions] = useState<{ place_id: string; display_name: string }[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleLocationChange = async (val: string) => {
    setForm({ ...form, location: val });
    if (val.length > 2) {
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(val)}&countrycodes=in&format=json&limit=5`);
        const data = await res.json();
        setLocationSuggestions(data);
        setShowSuggestions(true);
      } catch {
        // ignore
      }
    } else {
      setShowSuggestions(false);
    }
  };

  const calculateCompleteness = () => {
    let score = 0;
    const total = 6;
    if (form.name.trim()) score++;
    if (form.location.trim()) score++;
    if (form.phone.trim()) score++;
    if (form.landSize.trim()) score++;
    if (form.crops.length > 0) score++;
    if (form.soil && form.irrigation) score++;
    return Math.round((score / total) * 100);
  };
  const completeness = calculateCompleteness();

  const handleSave = () => {
    if (!form.name.trim() || !form.location.trim() || !form.landSize.trim()) {
      toast({
        title: "Missing fields",
        description: "Please fill in Name, Location and Land Size.",
        variant: "destructive",
      });
      return;
    }
    localStorage.setItem("krishi-ai-profile", JSON.stringify(form));
    setSaved(true);
    toast({ title: t("profile.saved") || "Profile Saved Successfully" });
    setTimeout(() => {
      setSaved(false);
      navigate("/reports");
    }, 1500);
  };

  const initials = form.name
    ? form.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "KA";

  return (
    <div className="min-h-screen bg-mesh pb-28">
      {/* Header */}
      <div className="glass-card backdrop-blur-md border-b border-white/30 px-4 py-4 sticky top-0 z-30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="p-2 rounded-xl hover:bg-muted transition-colors">
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </button>
            <div>
              <h1 className="text-lg font-display font-bold text-foreground flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                {t("profile.title")}
              </h1>
              <p className="text-xs font-body text-muted-foreground">{t("profile.subtitle")}</p>
            </div>
          </div>
          <LanguageSwitcher />
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-lg">
        {/* Profile Completeness Bar */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-display font-bold text-foreground uppercase tracking-wider">{t("profile.completeness")}</span>
            <span className="text-xs font-display font-bold text-primary">{completeness}%</span>
          </div>
          <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden border border-border/40">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${completeness}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full rounded-full gradient-hero"
            />
          </div>
        </div>

        <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-5">
          {/* Avatar + Personal Info Section */}
          <motion.div variants={fadeUp} className="glass-card rounded-2xl border border-white/30 p-6 card-hover-glow shadow-card">
            <div className="flex items-center gap-4 mb-5">
              <div className="w-16 h-16 rounded-2xl gradient-hero flex items-center justify-center text-primary-foreground font-display font-bold text-xl shadow-md border border-primary/20">
                {initials}
              </div>
              <div className="flex-1">
                <p className="text-xs font-display font-semibold text-muted-foreground uppercase tracking-wider mb-1">{t("profile.personalInfo")}</p>
                <p className="text-sm font-body text-foreground font-medium">{form.name || t("profile.setProfile")}</p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Name */}
              <div className="space-y-1.5">
                <Label className="flex items-center gap-2 text-xs font-display font-semibold text-foreground">
                  <User className="w-3.5 h-3.5 text-primary" />
                  {t("profile.name")}
                </Label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder={t("profile.namePlaceholder") || "Enter your full name"}
                  maxLength={100}
                  className="rounded-xl border border-border/60 bg-background/50 h-11 text-sm font-body focus:border-primary transition-colors focus-visible:ring-1 focus-visible:ring-primary/20"
                />
              </div>

              {/* Phone */}
              <div className="space-y-1.5">
                <Label className="flex items-center gap-2 text-xs font-display font-semibold text-foreground">
                  <Phone className="w-3.5 h-3.5 text-primary" />
                  {t("profile.phone")}
                </Label>
                <Input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value.replace(/[^0-9+]/g, '') })}
                  placeholder={t("profile.phonePlaceholder")}
                  maxLength={15}
                  className="rounded-xl border border-border/60 bg-background/50 h-11 text-sm font-body focus:border-primary transition-colors focus-visible:ring-1 focus-visible:ring-primary/20"
                />
              </div>

              {/* Location */}
              <div className="space-y-1.5 relative">
                <Label className="flex items-center gap-2 text-xs font-display font-semibold text-foreground">
                  <MapPin className="w-3.5 h-3.5 text-primary" />
                  {t("profile.location") || "Location"}
                </Label>
                <Input
                  value={form.location}
                  onChange={(e) => handleLocationChange(e.target.value)}
                  onFocus={() => {
                    if (locationSuggestions.length > 0) setShowSuggestions(true);
                  }}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  placeholder={t("profile.locationPlaceholder") || "Enter your location (Village, District)"}
                  maxLength={200}
                  className="rounded-xl border border-border/60 bg-background/50 h-11 text-sm font-body focus:border-primary transition-colors focus-visible:ring-1 focus-visible:ring-primary/20"
                />
                {showSuggestions && locationSuggestions.length > 0 && (
                  <div className="absolute top-[64px] left-0 right-0 z-20 bg-card border border-border/60 mt-1 rounded-xl shadow-elevated max-h-48 overflow-y-auto">
                    {locationSuggestions.map((loc) => (
                      <div
                        key={loc.place_id}
                        className="p-3 hover:bg-primary/5 cursor-pointer text-sm font-body border-b border-border/30 last:border-0 truncate transition-colors"
                        onClick={() => {
                          setForm({ ...form, location: loc.display_name });
                          setShowSuggestions(false);
                        }}
                      >
                        {loc.display_name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Farm Details Section */}
          <motion.div variants={fadeUp} className="glass-card rounded-2xl border border-white/30 p-6 card-hover-glow shadow-card">
            <p className="text-xs font-display font-semibold text-muted-foreground uppercase tracking-wider mb-4">{t("profile.farmDetails")}</p>

            <div className="space-y-4">
              {/* Land Size */}
              <div className="space-y-1.5">
                <Label className="flex items-center gap-2 text-xs font-display font-semibold text-foreground">
                  <Ruler className="w-3.5 h-3.5 text-primary" />
                  {t("profile.landSize")}
                </Label>
                <div className="relative flex items-center">
                  <Input
                    type="number"
                    min="0"
                    step="0.1"
                    value={form.landSize}
                    onChange={(e) => setForm({ ...form, landSize: e.target.value })}
                    placeholder={t("profile.landPlaceholder") || "e.g. 2.5"}
                    className="rounded-xl border border-border/60 bg-background/50 h-11 text-sm font-body focus:border-primary transition-colors pr-16 focus-visible:ring-1 focus-visible:ring-primary/20"
                  />
                  <span className="absolute right-4 text-xs font-display font-semibold text-muted-foreground pointer-events-none">
                    Acres
                  </span>
                </div>
              </div>

              {/* Soil Type */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-xs font-display font-semibold text-foreground">
                  <Layers className="w-3.5 h-3.5 text-primary" />
                  {t("profile.soilType")}
                </Label>
                <div className="flex flex-wrap gap-2">
                  {soilTypeKeys.map((key, i) => (
                    <button
                      key={key}
                      onClick={() => setForm({ ...form, soil: form.soil === soilValues[i] ? "" : soilValues[i] })}
                      className={`px-3 py-1.5 rounded-xl text-xs font-display font-semibold transition-all border ${
                        form.soil === soilValues[i]
                          ? "bg-primary text-primary-foreground border-primary shadow-sm"
                          : "bg-background/50 border-border/60 text-foreground hover:border-primary/40"
                      }`}
                    >
                      {t(`profile.soil.${key}`)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Irrigation Method */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-xs font-display font-semibold text-foreground">
                  <Droplets className="w-3.5 h-3.5 text-primary" />
                  {t("profile.irrigation")}
                </Label>
                <div className="flex flex-wrap gap-2">
                  {irrigationKeys.map((key, i) => (
                    <button
                      key={key}
                      onClick={() => setForm({ ...form, irrigation: form.irrigation === irrigationValues[i] ? "" : irrigationValues[i] })}
                      className={`px-3 py-1.5 rounded-xl text-xs font-display font-semibold transition-all border ${
                        form.irrigation === irrigationValues[i]
                          ? "bg-primary text-primary-foreground border-primary shadow-sm"
                          : "bg-background/50 border-border/60 text-foreground hover:border-primary/40"
                      }`}
                    >
                      {t(`profile.irr.${key}`)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Crops */}
              <div className="space-y-1.5 pt-1">
                <Label className="flex items-center gap-2 text-xs font-display font-semibold text-foreground">
                  <Sprout className="w-3.5 h-3.5 text-primary" />
                  {t("profile.crops")}
                </Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {form.crops.map((crop) => (
                    <span key={crop} className="px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[11px] font-display font-semibold flex items-center gap-1 shadow-sm">
                      {crop}
                      <button onClick={() => setForm({ ...form, crops: form.crops.filter(c => c !== crop) })} className="hover:text-destructive transition-colors">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <Input
                  value={cropInput}
                  onChange={(e) => setCropInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && cropInput.trim()) {
                      e.preventDefault();
                      if (!form.crops.includes(cropInput.trim())) {
                        setForm({ ...form, crops: [...form.crops, cropInput.trim()] });
                      }
                      setCropInput("");
                    }
                  }}
                  placeholder={t("profile.cropsPlaceholder") || "Type a crop and press Enter"}
                  maxLength={50}
                  className="rounded-xl border border-border/60 bg-background/50 h-11 text-sm font-body focus:border-primary transition-colors focus-visible:ring-1 focus-visible:ring-primary/20"
                />
              </div>

              {/* Experience */}
              <div className="space-y-2 pt-1">
                <Label className="flex items-center gap-2 text-xs font-display font-semibold text-foreground">
                  <Award className="w-3.5 h-3.5 text-primary" />
                  {t("profile.experience") || "Farming Experience"}
                </Label>
                <RadioGroup
                  value={form.experience}
                  onValueChange={(val) => setForm({ ...form, experience: val })}
                  className="flex gap-2"
                >
                  {(["beginner", "intermediate", "expert"] as const).map((level) => (
                    <div
                      key={level}
                      onClick={() => setForm({ ...form, experience: level })}
                      className={`flex-1 flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition-all text-center justify-center ${
                        form.experience === level
                          ? "border-primary bg-primary/10 shadow-sm"
                          : "border-border/60 bg-background/50 hover:border-primary/30"
                      }`}
                    >
                      <RadioGroupItem value={level} id={level} className="sr-only" />
                      <Label htmlFor={level} className="text-[11px] font-display font-semibold text-foreground cursor-pointer pointer-events-none">
                        {t(`profile.exp.${level}`) || level}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </div>
          </motion.div>

          {/* Save Button */}
          <motion.button
            variants={fadeUp}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSave}
            className={`w-full py-4 rounded-xl font-display font-bold text-base flex items-center justify-center gap-2.5 shadow-lg transition-all duration-300 mt-2 ${
              saved
                ? "bg-primary text-primary-foreground shadow-primary/20"
                : "gradient-hero text-primary-foreground hover:shadow-xl hover:shadow-primary/20"
            }`}
          >
            {saved ? <Check className="w-5 h-5" /> : <Save className="w-5 h-5" />}
            {t("profile.save") || "Save Profile"}
          </motion.button>
        </motion.div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Profile;

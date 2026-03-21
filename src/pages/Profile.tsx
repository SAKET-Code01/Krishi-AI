import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, User, MapPin, Ruler, Sprout, Award, Save, Check, Sun, Cloud, CloudRain, Wind } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import BottomNav from "@/components/BottomNav";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "@/hooks/use-toast";

const Profile = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [saved, setSaved] = useState(false);

  const [form, setForm] = useState(() => {
    const stored = localStorage.getItem("krishi-ai-profile");
    return stored
      ? JSON.parse(stored)
      : { name: "", location: "", landSize: "", experience: "beginner", crops: "", weather: "Sunny" };
  });

  const [locationSuggestions, setLocationSuggestions] = useState<any[]>([]);
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

  const handleSave = () => {
    if (!form.name.trim() || !form.location.trim() || !form.landSize.trim()) {
      toast({
        title: "Missing fields",
        description: "Please fill in name, location and land size.",
        variant: "destructive",
      });
      return;
    }
    localStorage.setItem("krishi-ai-profile", JSON.stringify(form));
    setSaved(true);
    toast({ title: t("profile.saved") });
    setTimeout(() => {
      setSaved(false);
      navigate("/reports");
    }, 1500);
  };

  const initials = form.name
    ? form.name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
    : "KA";

  return (
    <div className="min-h-screen bg-mesh pb-28">
      {/* Header */}
      <div className="bg-card/80 backdrop-blur-md border-b border-border/40 px-4 py-4 sticky top-0 z-30">
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Avatar + Name Section */}
          <div className="bg-card rounded-2xl border border-border/40 p-6 card-hover-glow">
            <div className="flex items-center gap-4 mb-5">
              <div className="w-16 h-16 rounded-2xl gradient-hero flex items-center justify-center text-primary-foreground font-display font-bold text-xl shadow-md">
                {initials}
              </div>
              <div className="flex-1">
                <p className="text-xs font-display font-semibold text-muted-foreground uppercase tracking-wider mb-1">Personal Info</p>
                <p className="text-sm font-body text-muted-foreground">{form.name || "Set your farmer profile"}</p>
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
                  placeholder={t("profile.namePlaceholder")}
                  maxLength={100}
                  className="rounded-xl border border-border/60 bg-background h-11 text-sm font-body focus:border-primary transition-colors"
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
                  placeholder={t("profile.locationPlaceholder") || "Enter your location"}
                  maxLength={200}
                  className="rounded-xl border border-border/60 bg-background h-11 text-sm font-body focus:border-primary transition-colors"
                />
                {showSuggestions && locationSuggestions.length > 0 && (
                  <div className="absolute top-[64px] left-0 right-0 z-20 bg-card border border-border/60 mt-1 rounded-xl shadow-elevated max-h-48 overflow-y-auto">
                    {locationSuggestions.map((loc: any) => (
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
          </div>

          {/* Farm Details Section */}
          <div className="bg-card rounded-2xl border border-border/40 p-6 card-hover-glow">
            <p className="text-xs font-display font-semibold text-muted-foreground uppercase tracking-wider mb-4">Farm Details</p>

            <div className="space-y-4">
              {/* Land Size */}
              <div className="space-y-1.5">
                <Label className="flex items-center gap-2 text-xs font-display font-semibold text-foreground">
                  <Ruler className="w-3.5 h-3.5 text-primary" />
                  {t("profile.landSize")}
                </Label>
                <Input
                  type="number"
                  min="0"
                  step="0.1"
                  value={form.landSize}
                  onChange={(e) => setForm({ ...form, landSize: e.target.value })}
                  placeholder={t("profile.landPlaceholder")}
                  className="rounded-xl border border-border/60 bg-background h-11 text-sm font-body focus:border-primary transition-colors"
                />
              </div>

              {/* Crops */}
              <div className="space-y-1.5">
                <Label className="flex items-center gap-2 text-xs font-display font-semibold text-foreground">
                  <Sprout className="w-3.5 h-3.5 text-primary" />
                  {t("profile.crops")}
                </Label>
                <Input
                  value={form.crops}
                  onChange={(e) => setForm({ ...form, crops: e.target.value })}
                  placeholder={t("profile.cropsPlaceholder")}
                  maxLength={300}
                  className="rounded-xl border border-border/60 bg-background h-11 text-sm font-body focus:border-primary transition-colors"
                />
              </div>

              {/* Experience */}
              <div className="space-y-2">
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
                      className={`flex-1 flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition-all text-center justify-center ${
                        form.experience === level
                          ? "border-primary bg-primary/8 shadow-sm"
                          : "border-border/60 bg-background hover:border-primary/30"
                      }`}
                    >
                      <RadioGroupItem value={level} id={level} className="sr-only" />
                      <Label htmlFor={level} className="text-xs font-display font-semibold text-foreground cursor-pointer">
                        {t(`profile.exp.${level}`) || level}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </div>
          </div>

          {/* Weather Section */}
          <div className="bg-card rounded-2xl border border-border/40 p-6 card-hover-glow">
            <p className="text-xs font-display font-semibold text-muted-foreground uppercase tracking-wider mb-4">Weather Context</p>

            <Label className="flex items-center gap-2 text-xs font-display font-semibold text-foreground mb-3">
              <Sun className="w-3.5 h-3.5 text-primary" />
              {t("profile.weather") || "Current Weather Context"}
            </Label>
            <div className="grid grid-cols-2 gap-2.5">
              {(["Sunny", "Rainy", "Cloudy", "Windy"] as const).map((w) => (
                <div
                  key={w}
                  onClick={() => setForm({ ...form, weather: w })}
                  className={`flex items-center gap-2.5 p-3 rounded-xl border cursor-pointer transition-all ${
                    form.weather === w
                      ? "border-primary bg-primary/8 shadow-sm"
                      : "border-border/60 bg-background hover:border-primary/30"
                  }`}
                >
                  {w === "Sunny" && <Sun className="w-4 h-4 text-amber-500" />}
                  {w === "Rainy" && <CloudRain className="w-4 h-4 text-blue-500" />}
                  {w === "Cloudy" && <Cloud className="w-4 h-4 text-slate-400" />}
                  {w === "Windy" && <Wind className="w-4 h-4 text-teal-500" />}
                  <span className="text-sm font-body text-foreground">{t(`weather.${w.toLowerCase()}`)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Save Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSave}
            className={`w-full py-4 rounded-xl font-display font-bold text-base flex items-center justify-center gap-2.5 shadow-lg transition-all duration-300 ${
              saved
                ? "bg-primary text-primary-foreground"
                : "gradient-hero text-primary-foreground hover:shadow-xl"
            }`}
          >
            {saved ? <Check className="w-5 h-5" /> : <Save className="w-5 h-5" />}
            {t("profile.save")}
          </motion.button>
        </motion.div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Profile;

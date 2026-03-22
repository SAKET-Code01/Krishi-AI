import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload, Camera, Stethoscope, Leaf, Bug, Droplets, ArrowLeft,
  CheckCircle, AlertTriangle, RefreshCw, Trash2, MapPin, Sun, Cloud, CloudRain, Wind,
  XCircle, Lightbulb, Shield, ImageOff
} from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface DiagnosisResult {
  disease: string;
  confidence: number;
  isHealthy?: boolean;
  isNonCrop?: boolean;
  explanation?: string;
  symptoms: string[];
  treatment: string[];
  fertilizers: string[];
  suggestion?: string;
}

interface ScanRecord {
  id: string;
  disease: string;
  date: string;
  confidence: number;
  status: "resolved" | "critical" | "monitoring";
  thumbnail?: string;
}

const SCAN_HISTORY_KEY = "krishi-scan-history";

const CropDoctor = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [image, setImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [scanHistory, setScanHistory] = useState<ScanRecord[]>([]);
  const [dragOver, setDragOver] = useState(false);

  const [location, setLocation] = useState("");
  const [weather, setWeather] = useState("Sunny");
  const [locationSuggestions, setLocationSuggestions] = useState<{ place_id: string; display_name: string }[]>([]);
  const [showLocSuggestions, setShowLocSuggestions] = useState(false);

  useEffect(() => {
    const savedHistory = localStorage.getItem(SCAN_HISTORY_KEY);
    if (savedHistory) setScanHistory(JSON.parse(savedHistory));

    const savedProfile = localStorage.getItem("krishi-ai-profile");
    if (savedProfile) {
      try {
        const parsed = JSON.parse(savedProfile);
        if (parsed.location) setLocation(parsed.location);
        if (parsed.weather) setWeather(parsed.weather);
      } catch (err) {
        // Ignore parsing errors
      }
    }
  }, []);

  const handleLocationChange = async (val: string) => {
    setLocation(val);
    if (val.length > 2) {
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(val)}&countrycodes=in&format=json&limit=5`);
        const data = await res.json();
        setLocationSuggestions(data);
        setShowLocSuggestions(true);
      } catch (err) {
        // Ignore fetch errors
      }
    } else {
      setShowLocSuggestions(false);
    }
  };

  const saveScanToHistory = (diagnosis: DiagnosisResult, thumbnail?: string) => {
    if (diagnosis.isNonCrop) return; // Don't save non-crop rejections
    const newRecord: ScanRecord = {
      id: Date.now().toString(),
      disease: diagnosis.disease,
      date: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
      confidence: diagnosis.confidence,
      status: diagnosis.isHealthy ? "resolved" : diagnosis.confidence >= 80 ? "critical" : "monitoring",
      thumbnail,
    };
    const updated = [newRecord, ...scanHistory].slice(0, 5);
    setScanHistory(updated);
    localStorage.setItem(SCAN_HISTORY_KEY, JSON.stringify(updated));
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Please upload a valid image file (JPG, PNG, WEBP).");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("Image is too large. Maximum file size is 10MB.");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result as string);
      setSelectedFile(file);
      setResult(null);
      setError(null);
    };
    reader.readAsDataURL(file);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  }, []);

  const analyzeImage = async (file: File, base64Preview: string) => {
    const formData = new FormData();
    formData.append("image", file);
    formData.append("prompt", "Analyze this crop image and provide a JSON diagnosis with disease name, confidence, symptoms, treatment, and fertilizer recommendations. Respond ONLY with valid JSON.");

    const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3001";
    const response = await fetch(`${backendUrl}/api/analyze`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) throw new Error(`API error: ${response.status}`);

    const data = await response.json();
    const rawText = data.text || "{}";
    const cleanJson = rawText.replace(/```json|```/g, "").trim();

    let aiResult: DiagnosisResult;
    try {
      aiResult = JSON.parse(cleanJson);
    } catch {
      aiResult = {
        disease: "Unable to parse result",
        confidence: 0,
        symptoms: ["The AI could not generate a structured response"],
        treatment: ["Please try uploading the image again"],
        fertilizers: [],
      };
    }

    setResult(aiResult);
    saveScanToHistory(aiResult, base64Preview);
  };

  const handleAnalyze = async () => {
    if (!image || !selectedFile) {
      setError("Please upload an image of a crop to proceed.");
      return;
    }
    setAnalyzing(true);
    setError(null);
    try {
      await analyzeImage(selectedFile, image);
    } catch (err) {
      console.error("Analysis error:", err);
      setError("Unable to analyze the image at the moment. Please try again.");
    } finally {
      setAnalyzing(false);
    }
  };

  const handleReset = () => {
    setImage(null);
    setSelectedFile(null);
    setResult(null);
    setError(null);
  };

  const clearHistory = () => {
    setScanHistory([]);
    localStorage.removeItem(SCAN_HISTORY_KEY);
  };

  const isHealthy = result?.isHealthy || result?.disease?.toLowerCase().includes("healthy");
  const isNonCrop = result?.isNonCrop;
  const isUncertain = result && result.confidence > 0 && result.confidence < 60;

  return (
    <div className="min-h-screen bg-mesh pb-28">
      {/* Header */}
      <div className="glass-card border-b border-white/30 px-4 py-4 sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 rounded-xl hover:bg-muted transition-colors">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <div className="flex items-center gap-2">
            <Stethoscope className="w-6 h-6 text-primary" />
            <div>
              <h1 className="text-lg font-display font-bold text-foreground">{t("crop.doctor.title")}</h1>
              <p className="text-[10px] font-body text-muted-foreground">AI-powered plant disease detection</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-5 max-w-lg space-y-5">
        {/* Context Card */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-2xl border border-white/30 p-4 card-hover-glow shadow-card">
          <div className="space-y-3">
            <div className="space-y-1.5 relative">
              <Label className="flex items-center gap-2 text-xs font-display font-semibold text-foreground">
                <MapPin className="w-3.5 h-3.5 text-primary" /> {t("profile.location") || "Field Location"}
              </Label>
              <Input
                value={location}
                onChange={(e) => handleLocationChange(e.target.value)}
                onFocus={() => { if (locationSuggestions.length > 0) setShowLocSuggestions(true); }}
                onBlur={() => setTimeout(() => setShowLocSuggestions(false), 200)}
                placeholder="Enter field location"
                className="rounded-xl border border-border/60 bg-background h-10 text-sm font-body focus:border-primary transition-colors"
              />
              {showLocSuggestions && locationSuggestions.length > 0 && (
                <div className="absolute top-[60px] left-0 right-0 z-20 bg-card border border-border/60 mt-1 rounded-xl shadow-elevated max-h-40 overflow-y-auto">
                  {locationSuggestions.map((loc: { place_id: string; display_name: string }) => (
                    <div key={loc.place_id} className="p-2.5 hover:bg-primary/5 cursor-pointer text-xs font-body border-b border-border/30 last:border-0 truncate" onClick={() => { setLocation(loc.display_name); setShowLocSuggestions(false); }}>
                      {loc.display_name}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-2">
              {(["Sunny", "Rainy", "Cloudy", "Windy"] as const).map((w) => (
                <div
                  key={w}
                  onClick={() => setWeather(w)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border cursor-pointer transition-all text-xs font-body flex-1 justify-center ${
                    weather === w ? "border-primary bg-primary/8 shadow-sm" : "border-border/60 bg-background hover:border-primary/30"
                  }`}
                >
                  {w === "Sunny" && <Sun className="w-3.5 h-3.5 text-amber-500" />}
                  {w === "Rainy" && <CloudRain className="w-3.5 h-3.5 text-blue-500" />}
                  {w === "Cloudy" && <Cloud className="w-3.5 h-3.5 text-slate-400" />}
                  {w === "Windy" && <Wind className="w-3.5 h-3.5 text-teal-500" />}
                  <span className="hidden sm:inline">{w}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Upload Area */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          {!image ? (
            <label
              className="block cursor-pointer"
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
            >
              <div className={`border-2 border-dashed rounded-2xl p-10 text-center transition-all duration-200 ${
                dragOver
                  ? "border-primary bg-primary/10 scale-[1.02]"
                  : "border-primary/30 bg-primary/5 hover:bg-primary/8 hover:border-primary/50"
              }`}>
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mx-auto mb-3">
                  <Camera className="w-8 h-8 text-primary" />
                </div>
                <p className="font-display font-bold text-foreground text-base mb-1">
                  {t("crop.upload.title")}
                </p>
                <p className="font-body text-muted-foreground text-sm">
                  {t("crop.upload.desc")}
                </p>
                <p className="text-[10px] text-muted-foreground mt-2 opacity-60">
                  Drag & drop or tap • JPG, PNG, WEBP up to 10MB
                </p>
              </div>
              <input type="file" accept="image/*" capture="environment" onChange={handleImageUpload} className="hidden" />
            </label>
          ) : (
            <div className="space-y-3">
              <div className="relative rounded-2xl overflow-hidden border border-border/40 shadow-md group">
                <img src={image} alt="Crop to analyze" className="w-full h-56 object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                <button
                  onClick={handleReset}
                  className="absolute top-3 right-3 px-3 py-1.5 rounded-lg bg-black/50 backdrop-blur-sm text-white font-display text-xs font-semibold flex items-center gap-1.5 hover:bg-black/70 transition-colors"
                >
                  <RefreshCw className="w-3 h-3" />
                  Change
                </button>
              </div>

              {!result && !error && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleAnalyze}
                  disabled={analyzing}
                  className="w-full py-3.5 rounded-xl gradient-hero text-primary-foreground font-display font-bold text-base flex items-center justify-center gap-2 disabled:opacity-60 shadow-lg transition-all"
                >
                  {analyzing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      {t("crop.analyzing")}
                    </>
                  ) : (
                    <>
                      <Upload className="w-5 h-5" />
                      {t("crop.analyze.btn")}
                    </>
                  )}
                </motion.button>
              )}

              {error && (
                <div className="bg-destructive/8 border border-destructive/20 rounded-xl p-4 flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-destructive shrink-0" />
                  <p className="text-sm font-body text-destructive flex-1">{error}</p>
                  <button onClick={handleAnalyze} className="text-xs font-display font-bold text-destructive underline shrink-0">Retry</button>
                </div>
              )}
            </div>
          )}
        </motion.div>

        {/* Results */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              {/* Non-crop rejection */}
              {isNonCrop ? (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-amber-100 flex items-center justify-center mx-auto mb-3">
                    <ImageOff className="w-7 h-7 text-amber-600" />
                  </div>
                  <h3 className="font-display font-bold text-amber-800 text-lg mb-1">Not a Crop Image</h3>
                  <p className="text-sm font-body text-amber-700">
                    Only crop-related images are accepted. Please upload a clear image of a crop leaf for disease analysis.
                  </p>
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={handleReset}
                    className="mt-4 px-6 py-2.5 rounded-xl bg-amber-600 text-white font-display font-semibold text-sm"
                  >
                    Upload Another Image
                  </motion.button>
                </div>
              ) : (
                <>
                  {/* Health Status Card */}
                  <div className={`rounded-2xl p-5 border ${
                    isHealthy
                      ? "bg-emerald-50 border-emerald-200"
                      : "bg-red-50 border-red-200"
                  }`}>
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        isHealthy ? "bg-emerald-100" : "bg-red-100"
                      }`}>
                        {isHealthy ? (
                          <CheckCircle className="w-6 h-6 text-emerald-600" />
                        ) : (
                          <Bug className="w-6 h-6 text-red-600" />
                        )}
                      </div>
                      <div>
                        <p className="text-[10px] font-display font-bold uppercase tracking-wider text-muted-foreground">
                          Crop Health
                        </p>
                        <p className={`text-lg font-display font-bold ${
                          isHealthy ? "text-emerald-700" : "text-red-700"
                        }`}>
                          {isHealthy ? "✅ Healthy" : "⚠️ Unhealthy"}
                        </p>
                      </div>
                    </div>

                    <div className={`rounded-xl p-3 mb-3 ${isHealthy ? "bg-emerald-100/50" : "bg-red-100/50"}`}>
                      <p className="text-xs font-display font-semibold text-muted-foreground mb-0.5">Detected Issue</p>
                      <p className={`font-display font-bold ${isHealthy ? "text-emerald-700" : "text-red-700"}`}>
                        {result.disease}
                      </p>
                    </div>

                    {/* Confidence bar */}
                    {result.confidence > 0 && (
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-xs font-display font-semibold text-muted-foreground">Confidence</p>
                          <p className={`text-xs font-display font-bold ${
                            result.confidence >= 80 ? isHealthy ? "text-emerald-600" : "text-red-600"
                            : result.confidence >= 60 ? "text-amber-600"
                            : "text-orange-500"
                          }`}>
                            {result.confidence}%
                          </p>
                        </div>
                        <div className="h-2 bg-white/80 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${result.confidence}%` }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className={`h-full rounded-full ${
                              isHealthy ? "bg-emerald-500"
                              : result.confidence > 80 ? "bg-red-500"
                              : result.confidence > 60 ? "bg-amber-500"
                              : "bg-orange-400"
                            }`}
                          />
                        </div>
                      </div>
                    )}

                    {/* Uncertain warning */}
                    {isUncertain && (
                      <div className="mt-3 flex items-start gap-2 bg-amber-100/50 rounded-lg p-2.5">
                        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <p className="text-xs font-body text-amber-700">
                          The result is uncertain. Please upload a clearer crop image for better accuracy.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Explanation */}
                  {result.explanation && (
                    <div className="bg-card rounded-2xl border border-border/40 p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Lightbulb className="w-4 h-4 text-amber-500" />
                        <h3 className="text-xs font-display font-bold text-foreground uppercase tracking-wide">Explanation</h3>
                      </div>
                      <p className="text-sm font-body text-muted-foreground leading-relaxed">{result.explanation}</p>
                    </div>
                  )}

                  {/* Symptoms */}
                  {result.symptoms?.length > 0 && !isHealthy && (
                    <div className="bg-card rounded-2xl border border-border/40 p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <AlertTriangle className="w-4 h-4 text-red-500" />
                        <h3 className="text-xs font-display font-bold text-foreground uppercase tracking-wide">Symptoms</h3>
                      </div>
                      <div className="space-y-1.5">
                        {result.symptoms.map((s, i) => (
                          <p key={i} className="text-sm font-body text-foreground flex items-start gap-2">
                            <span className="text-red-400 mt-1">•</span> {s}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Treatment */}
                  {!isHealthy && result.treatment?.length > 0 && (
                    <div className="bg-primary/5 rounded-2xl border border-primary/15 p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Leaf className="w-4 h-4 text-primary" />
                        <h3 className="text-xs font-display font-bold text-foreground uppercase tracking-wide">Treatment</h3>
                      </div>
                      <div className="space-y-2.5">
                        {result.treatment.map((step, i) => (
                          <div key={i} className="flex gap-3 items-start">
                            <span className="w-6 h-6 rounded-full bg-primary/15 text-primary font-display font-bold text-[10px] flex items-center justify-center shrink-0">
                              {i + 1}
                            </span>
                            <p className="text-sm font-body text-foreground leading-relaxed">{step}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Fertilizers */}
                  {result.fertilizers?.length > 0 && (
                    <div className="bg-secondary/5 rounded-2xl border border-secondary/15 p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Droplets className="w-4 h-4 text-secondary" />
                        <h3 className="text-xs font-display font-bold text-foreground uppercase tracking-wide">Fertilizers</h3>
                      </div>
                      <div className="space-y-2">
                        {result.fertilizers.map((f, i) => (
                          <div key={i} className="flex items-center gap-2 bg-secondary/5 rounded-lg p-2.5 border border-secondary/10">
                            <div className="w-2 h-2 rounded-full bg-secondary shrink-0" />
                            <p className="text-sm font-body text-foreground">{f}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Suggestion */}
                  {result.suggestion && (
                    <div className="bg-gradient-to-r from-primary/8 to-secondary/8 rounded-2xl border border-primary/15 p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Shield className="w-4 h-4 text-primary" />
                        <h3 className="text-xs font-display font-bold text-foreground uppercase tracking-wide">Pro Tip</h3>
                      </div>
                      <p className="text-sm font-body text-foreground leading-relaxed italic">{result.suggestion}</p>
                    </div>
                  )}
                </>
              )}

              {/* Scan Again */}
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleReset}
                className="w-full py-3 rounded-xl border border-border/60 text-foreground font-display font-semibold text-sm flex items-center justify-center gap-2 hover:bg-muted/50 transition-colors"
              >
                <Camera className="w-4 h-4" />
                Scan Another Plant
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Scan History */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-display font-bold text-foreground flex items-center gap-2">
              <Stethoscope className="w-4 h-4 text-primary" />
              {t("crop.recentScans")}
            </h2>
            {scanHistory.length > 0 && (
              <button onClick={clearHistory} className="text-[10px] text-muted-foreground flex items-center gap-1 hover:text-destructive transition-colors">
                <Trash2 className="w-3 h-3" /> Clear
              </button>
            )}
          </div>

          {scanHistory.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Stethoscope className="w-8 h-8 mx-auto mb-2 opacity-20" />
              <p className="text-xs font-body">No scans yet. Upload a plant photo to get started.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {scanHistory.map((scan) => (
                <motion.div
                  key={scan.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-card border border-border/40 rounded-xl p-3 flex items-center gap-3"
                >
                  {scan.thumbnail && (
                    <img src={scan.thumbnail} alt="" className="w-10 h-10 rounded-lg object-cover shrink-0 border border-border/30" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-display font-bold text-foreground text-sm truncate">{scan.disease}</p>
                    <p className="text-[10px] font-body text-muted-foreground">{scan.date} • {scan.confidence}%</p>
                  </div>
                  <span className={`text-[10px] font-display font-bold px-2 py-0.5 rounded-full shrink-0 ${
                    scan.status === "critical"
                      ? "bg-destructive/10 text-destructive border border-destructive/15"
                      : scan.status === "monitoring"
                      ? "bg-amber-500/10 text-amber-600 border border-amber-500/15"
                      : "bg-primary/10 text-primary border border-primary/15"
                  }`}>
                    {scan.status === "critical" ? "Critical" : scan.status === "monitoring" ? "Monitor" : "Healthy"}
                  </span>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default CropDoctor;

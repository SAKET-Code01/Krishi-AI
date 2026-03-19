import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Camera, Stethoscope, Leaf, Bug, Droplets, ArrowLeft, CheckCircle, AlertTriangle, RefreshCw, Trash2 } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

interface DiagnosisResult {
  disease: string;
  confidence: number;
  symptoms: string[];
  treatment: string[];
  fertilizers: string[];
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
  const { t, language } = useLanguage();
  const [image, setImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [scanHistory, setScanHistory] = useState<ScanRecord[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem(SCAN_HISTORY_KEY);
    if (saved) {
      setScanHistory(JSON.parse(saved));
    }
  }, []);

  const saveScanToHistory = (diagnosis: DiagnosisResult, thumbnail?: string) => {
    const newRecord: ScanRecord = {
      id: Date.now().toString(),
      disease: diagnosis.disease,
      date: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
      confidence: diagnosis.confidence,
      status: diagnosis.confidence >= 80 ? "critical" : "monitoring",
      thumbnail,
    };
    const updated = [newRecord, ...scanHistory].slice(0, 5); // Keep last 5 scans
    setScanHistory(updated);
    localStorage.setItem(SCAN_HISTORY_KEY, JSON.stringify(updated));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setResult(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async (base64Image: string) => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

    if (!apiKey || apiKey === "your_gemini_api_key_here") {
      // Fallback demo result
      const fallback: DiagnosisResult = {
        disease: "Bacterial Leaf Blight",
        confidence: 92,
        symptoms: ["Yellow-brown lesions on leaf edges", "Wilting of leaves", "Reduced grain filling"],
        treatment: [
          "Apply Streptocycline 0.01% spray",
          "Use copper oxychloride 0.25% solution",
          "Remove and destroy infected leaves",
          "Ensure proper field drainage",
        ],
        fertilizers: ["Potash (MOP) — 20kg/acre", "Zinc Sulphate — 5kg/acre"],
      };
      setResult(fallback);
      saveScanToHistory(fallback, base64Image);
      return;
    }

    const base64Data = base64Image.split(",")[1];
    const mimeType = base64Image.split(";")[0].split(":")[1];

    const langName = language === "or" ? "Odia" : language === "hi" ? "Hindi" : "English";

    const prompt = `You are an expert plant pathologist and agricultural scientist. Carefully analyze the provided plant/crop image and provide a detailed diagnosis.

IMPORTANT RULES:
1. Provide ALL text fields in ${langName} language/script
2. If the image is NOT a plant or crop, set disease to "No plant detected" and confidence to 0
3. If the plant appears healthy, set disease to "Healthy Plant" and confidence to 100
4. Confidence should be a number between 0-100 representing how certain you are
5. Be specific and actionable in your treatment and fertilizer recommendations
6. Return ONLY valid JSON, no markdown, no extra text

Return this exact JSON structure:
{
  "disease": "disease name or condition",
  "confidence": 85,
  "symptoms": ["symptom 1", "symptom 2", "symptom 3"],
  "treatment": ["step 1", "step 2", "step 3", "step 4"],
  "fertilizers": ["fertilizer 1 with dosage", "fertilizer 2 with dosage"]
}`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: prompt },
                {
                  inline_data: {
                    mime_type: mimeType,
                    data: base64Data,
                  },
                },
              ],
            },
          ],
          generationConfig: {
            maxOutputTokens: 1200,
            temperature: 0.1,
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
    const cleanJson = rawText.replace(/```json|```/g, "").trim();
    const aiResult: DiagnosisResult = JSON.parse(cleanJson);
    setResult(aiResult);
    saveScanToHistory(aiResult, base64Image);
  };

  const handleAnalyze = async () => {
    if (!image) return;
    setAnalyzing(true);
    setError(null);
    try {
      await analyzeImage(image);
    } catch (err) {
      console.error("AI Analysis Error:", err);
      setError("Could not analyze image. Please try again.");
    } finally {
      setAnalyzing(false);
    }
  };

  const handleReset = () => {
    setImage(null);
    setResult(null);
    setError(null);
  };

  const clearHistory = () => {
    setScanHistory([]);
    localStorage.removeItem(SCAN_HISTORY_KEY);
  };

  const isHealthy = result?.disease?.toLowerCase().includes("healthy");
  const noPlant = result?.confidence === 0;

  return (
    <div className="min-h-screen bg-background pb-28">
      {/* Header */}
      <div className="bg-card border-b-2 border-border px-4 py-4">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 rounded-xl hover:bg-muted transition-colors">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <div className="flex items-center gap-2">
            <Stethoscope className="w-6 h-6 text-primary" />
            <h1 className="text-xl font-display font-bold text-foreground">{t("crop.doctor.title")}</h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-lg">
        {/* Upload/Preview area */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          {!image ? (
            <label className="block cursor-pointer">
              <div className="border-2 border-dashed border-primary/40 rounded-2xl p-12 text-center bg-primary/5 hover:bg-primary/10 transition-all hover:border-primary/60">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mx-auto mb-4">
                  <Camera className="w-10 h-10 text-primary" />
                </div>
                <p className="font-display font-bold text-foreground text-lg mb-1">
                  {t("crop.upload.title")}
                </p>
                <p className="font-body text-muted-foreground text-sm">
                  {t("crop.upload.desc")}
                </p>
                <p className="text-xs text-muted-foreground mt-3 opacity-60">JPG, PNG, WEBP up to 10MB</p>
              </div>
              <input type="file" accept="image/*" capture="environment" onChange={handleImageUpload} className="hidden" />
            </label>
          ) : (
            <div className="space-y-4">
              <div className="relative rounded-2xl overflow-hidden border-2 border-border shadow-lg">
                <img src={image} alt="Plant" className="w-full h-64 object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                <button
                  onClick={handleReset}
                  className="absolute top-3 right-3 px-3 py-1.5 rounded-lg bg-black/50 backdrop-blur-sm text-white font-display text-sm font-semibold flex items-center gap-1.5 hover:bg-black/70 transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  {t("crop.change")}
                </button>
              </div>

              {!result && !error && (
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={handleAnalyze}
                  disabled={analyzing}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-primary to-primary/80 text-primary-foreground font-display font-bold text-lg flex items-center justify-center gap-2 disabled:opacity-60 shadow-lg shadow-primary/20 transition-all hover:shadow-primary/30"
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
                <div className="bg-destructive/10 border-2 border-destructive/30 rounded-xl p-4 flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-destructive shrink-0" />
                  <p className="text-sm font-body text-destructive">{error}</p>
                  <button onClick={handleAnalyze} className="ml-auto text-xs font-display font-bold text-destructive underline">Retry</button>
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
              className="mt-6 space-y-4"
            >
              {/* Diagnosis Card */}
              <div className={`border-2 rounded-2xl p-5 ${isHealthy ? "bg-green-500/5 border-green-500/20" : noPlant ? "bg-muted border-border" : "bg-destructive/5 border-destructive/20"}`}>
                <div className="flex items-center gap-2 mb-3">
                  {isHealthy ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <Bug className="w-5 h-5 text-destructive" />
                  )}
                  <h3 className="font-display font-bold text-foreground">{t("crop.diagnosis")}</h3>
                </div>
                <p className={`font-display font-bold text-xl ${isHealthy ? "text-green-500" : "text-destructive"}`}>
                  {result.disease}
                </p>
                {result.confidence > 0 && (
                  <div className="mt-3">
                    <div className="flex items-center justify-between mb-1.5">
                      <p className="text-sm font-body text-muted-foreground">{t("crop.confidence")}</p>
                      <p className="text-sm font-display font-bold text-foreground">{result.confidence}%</p>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${result.confidence}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className={`h-full rounded-full ${isHealthy ? "bg-green-500" : result.confidence > 80 ? "bg-destructive" : "bg-yellow-500"}`}
                      />
                    </div>
                  </div>
                )}
                {result.symptoms.length > 0 && (
                  <div className="mt-4 space-y-1.5">
                    {result.symptoms.map((symptom, i) => (
                      <p key={i} className="text-sm font-body text-foreground flex items-start gap-2">
                        <span className="text-primary mt-0.5">•</span>
                        {symptom}
                      </p>
                    ))}
                  </div>
                )}
              </div>

              {/* Treatment */}
              {!isHealthy && !noPlant && result.treatment.length > 0 && (
                <div className="bg-primary/5 border-2 border-primary/20 rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <Leaf className="w-5 h-5 text-primary" />
                    <h3 className="font-display font-bold text-foreground">{t("crop.treatment")}</h3>
                  </div>
                  <div className="space-y-3">
                    {result.treatment.map((step, i) => (
                      <div key={i} className="flex gap-3 items-start">
                        <span className="w-6 h-6 rounded-full bg-primary/15 text-primary font-display font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                          {i + 1}
                        </span>
                        <p className="text-sm font-body text-foreground leading-relaxed">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Fertilizers */}
              {!noPlant && result.fertilizers.length > 0 && (
                <div className="bg-secondary/5 border-2 border-secondary/20 rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <Droplets className="w-5 h-5 text-secondary" />
                    <h3 className="font-display font-bold text-foreground">{t("crop.fertilizers")}</h3>
                  </div>
                  <div className="space-y-2">
                    {result.fertilizers.map((fert, i) => (
                      <div key={i} className="flex items-center gap-2 bg-secondary/5 rounded-xl p-3 border border-secondary/10">
                        <div className="w-2 h-2 rounded-full bg-secondary shrink-0" />
                        <p className="text-sm font-body text-foreground">{fert}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Scan again button */}
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleReset}
                className="w-full py-3 rounded-xl border-2 border-border text-foreground font-display font-semibold flex items-center justify-center gap-2 hover:bg-muted transition-colors"
              >
                <Camera className="w-4 h-4" />
                Scan Another Plant
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Recent Scans History */}
        <div className="mt-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-display font-bold text-foreground">{t("crop.recentScans")}</h2>
            {scanHistory.length > 0 && (
              <button onClick={clearHistory} className="text-xs text-muted-foreground flex items-center gap-1 hover:text-destructive transition-colors">
                <Trash2 className="w-3.5 h-3.5" />
                Clear
              </button>
            )}
          </div>

          {scanHistory.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              <Stethoscope className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="text-sm font-body">No scans yet. Upload a plant photo to get started.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {scanHistory.map((scan) => (
                <motion.div
                  key={scan.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-card border-2 border-border rounded-xl p-4 flex items-center gap-3"
                >
                  {scan.thumbnail && (
                    <img src={scan.thumbnail} alt="" className="w-12 h-12 rounded-lg object-cover shrink-0 border border-border" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-display font-bold text-foreground truncate">{scan.disease}</p>
                    <p className="text-xs font-body text-muted-foreground">{scan.date} • {scan.confidence}% confidence</p>
                  </div>
                  <span
                    className={`text-xs font-display font-bold px-2.5 py-1 rounded-full shrink-0 ${
                      scan.status === "critical"
                        ? "bg-destructive/10 text-destructive border border-destructive/20"
                        : "bg-primary/10 text-primary border border-primary/20"
                    }`}
                  >
                    {scan.status === "critical" ? t("crop.status.critical") : t("crop.status.resolved")}
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

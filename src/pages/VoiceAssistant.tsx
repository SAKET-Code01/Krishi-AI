import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, Volume2, ArrowLeft, MessageSquare, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

type ChatMessage = {
  role: "user" | "assistant";
  text: string;
};

type SpeechRecognitionResultLike = {
  isFinal: boolean;
  [index: number]: {
    transcript: string;
  };
};

type SpeechRecognitionEventLike = {
  resultIndex: number;
  results: ArrayLike<SpeechRecognitionResultLike>;
};

type SpeechRecognitionLike = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};

type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  }
}

const VoiceAssistant = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();

  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const silenceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);

  const processText = useCallback(async (text: string) => {
    const trimmedText = text.trim();
    if (!trimmedText) return;

    setIsProcessing(true);
    setLiveTranscript("");
    setMessages((prev) => [...prev, { role: "user", text: trimmedText }]);

    try {
      const systemMsg = `You are 'Krushi Sahayaka', a wise agricultural expert. Provide advice on rice, pulses, soil health, and weather. IMPORTANT: Always respond in ${
                      language === "or"
                        ? "Odia"
                        : language === "hi"
                          ? "Hindi"
                          : "English"
                    } script. Keep answers simple, traditional, and helpful.`;

      const response = await fetch("http://localhost:3001/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: `Answer the farmer's question: ${trimmedText}`,
          systemPrompt: systemMsg
        }),
      });

      if (!response.ok) throw new Error("Backend connection failed");

      const data = await response.json();
      const responseText = data.text || t("voice.err.understand");

      setMessages((prev) => [...prev, { role: "assistant", text: responseText }]);

      const utterance = new SpeechSynthesisUtterance(responseText);
      utterance.lang =
        language === "or"
          ? "or-IN"
          : language === "hi"
            ? "hi-IN"
            : "en-IN";

      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    } catch (error) {
      console.error("Process error", error);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: t("voice.err.network") },
      ]);
    } finally {
      setIsProcessing(false);
    }
  }, [language, t]);

  const stopRecording = useCallback(() => {
    if (!recognitionRef.current || !isRecording) {
      return;
    }

    recognitionRef.current.stop();
    setIsRecording(false);

    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
  }, [isRecording]);

  const handleFinalize = useCallback((text: string) => {
    stopRecording();
    void processText(text);
  }, [processText, stopRecording]);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang =
      language === "or"
        ? "or-IN"
        : language === "hi"
          ? "hi-IN"
          : "en-IN";

    recognition.onresult = (event: SpeechRecognitionEventLike) => {
      let interimTranscript = "";
      let finalTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }

      const currentText = (finalTranscript + interimTranscript).toLowerCase();
      setLiveTranscript(currentText);

      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
      }

      silenceTimerRef.current = setTimeout(() => {
        if (currentText.trim() && isRecording) {
          handleFinalize(currentText);
        }
      }, 2000);
    };

    recognition.onend = () => {
      if (isRecording) {
        recognition.start();
      }
    };

    recognitionRef.current = recognition;
  }, [handleFinalize, isRecording, language]);

  useEffect(() => {
    return () => {
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
      }
    };
  }, []);

  const startRecording = () => {
    if (!recognitionRef.current) {
      return;
    }

    setLiveTranscript("");
    recognitionRef.current.start();
    setIsRecording(true);
  };

  return (
    <div className="min-h-screen bg-[#f0f9f0] pb-10 flex flex-col items-center">
      <div className="w-full bg-white/80 backdrop-blur-md border-b border-green-100 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-full hover:bg-green-50 transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-green-700" />
        </button>

        <h1 className="text-xl font-display font-bold text-green-800">
          {t("voice.title")}
        </h1>

        <div className="w-10" />
      </div>

      <div className="flex-1 w-full max-w-md px-6 flex flex-col items-center justify-center space-y-12">
        <div className="relative">
          <motion.div
            animate={isRecording ? { scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] } : {}}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="absolute inset-0 bg-green-400 rounded-full blur-3xl opacity-20"
          />

          <div className="relative w-48 h-48 rounded-full bg-gradient-to-tr from-green-500 to-emerald-400 p-1 shadow-2xl overflow-hidden">
            <div className="w-full h-full rounded-full bg-green-50 flex items-center justify-center">
              {isProcessing ? (
                <Loader2 className="w-16 h-16 text-green-600 animate-spin" />
              ) : (
                <MessageSquare className="w-16 h-16 text-green-600" />
              )}
            </div>
          </div>
        </div>

        <div className="text-center space-y-4">
          <h2 className="text-2xl font-display font-extrabold text-green-900 leading-tight">
            {t("voice.greeting")} <br />
            <span className="text-green-600">{t("voice.howHelp")}</span>
          </h2>

          <p className="text-green-700/60 font-body text-sm px-8">
            {t("voice.prompt")}
          </p>
        </div>

        <AnimatePresence>
          {isRecording && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 10 }}
              className="flex flex-col items-center space-y-3"
            >
              <div className="bg-white/95 backdrop-blur-md px-6 py-4 rounded-3xl shadow-xl border border-green-200 max-w-xs text-center">
                <p className="text-green-800 font-display font-medium text-lg leading-relaxed">
                  {liveTranscript || "...."}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex flex-col items-center space-y-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.9 }}
            onClick={isRecording ? stopRecording : startRecording}
            className={`w-32 h-32 rounded-full flex items-center justify-center transition-all ${
              isRecording
                ? "bg-red-500 shadow-xl ring-8 ring-red-100"
                : "bg-green-600 shadow-2xl ring-8 ring-green-100"
            }`}
          >
            {isRecording ? (
              <MicOff className="w-12 h-12 text-white" />
            ) : (
              <Mic className="w-12 h-12 text-white" />
            )}
          </motion.button>

          <div className="text-center">
            <span
              className={`text-lg font-display font-bold ${
                isRecording ? "text-red-600" : "text-green-800"
              }`}
            >
              {isRecording ? t("voice.listening") : t("voice.talkToMe")}
            </span>
          </div>
        </div>

        <AnimatePresence>
          {messages.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full bg-white rounded-3xl p-6 shadow-sm border border-green-50 mt-4 h-32 overflow-y-auto"
            >
              <div className="flex items-start gap-3">
                <Volume2 className="w-5 h-5 text-green-600 mt-1 shrink-0" />

                <p className="text-green-900 font-body text-sm leading-relaxed">
                  {messages[messages.length - 1].text}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default VoiceAssistant;

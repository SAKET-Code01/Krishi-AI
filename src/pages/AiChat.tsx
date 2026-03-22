import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, ArrowLeft, Bot, Sparkles, Mic, MicOff, Volume2, VolumeX, X, Paperclip, MoreVertical, CheckCheck, Image as ImageIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

type Message = {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
  imageUrl?: string;
  isError?: boolean;
};

const FormattedMessage = ({ text }: { text: string }) => {
  const lines = text.split('\n');
  return (
    <div className="space-y-1">
      {lines.map((line, i) => {
        const parts = line.split(/(\*\*.*?\*\*)/g);
        const formattedLine = parts.map((part, j) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={j} className="font-bold">{part.slice(2, -2)}</strong>;
          }
          return part;
        });

        const trimmed = line.trim();
        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          return <li key={i} className="ml-4 list-disc marker:text-primary/70">{formattedLine}</li>;
        }
        
        return <p key={i} className="min-h-[1rem] leading-relaxed">{formattedLine}</p>;
      })}
    </div>
  );
};

const AiChat = () => {
  const navigate = useNavigate();
  const { language, setLanguage, t } = useLanguage();
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const [isListening, setIsListening] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);

  // Initial greeting
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: "greeting",
          text: t("aiChat.greeting") || "Hello! I am Krishi AI. How can I assist you with your farming today?",
          sender: "ai",
          timestamp: new Date(),
        },
      ]);
      
      // Attempt to greet with voice if enabled, though browsers usually block autoplay TTS
      // We'll skip autoplay TTS to respect browser policies and only speak on responses.
    }
  }, [t, messages.length]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, imagePreview]);

  // Init Speech Recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = language === "or" ? "or-IN" : language === "hi" ? "hi-IN" : "en-IN";
      
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .map((result: any) => result[0])
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .map((result: any) => result.transcript)
          .join('');
        setInput(transcript);
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      recognition.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, [language]);

  const toggleListen = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      if (recognitionRef.current) {
        setInput(""); // Clear previous input before listening
        recognitionRef.current.start();
        setIsListening(true);
      } else {
        alert("Speech recognition is not supported in this browser.");
      }
    }
  };

  const speakText = useCallback((text: string) => {
    if (!voiceEnabled || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    
    const cleanText = text.replace(/[*#]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = language === "or" ? "or-IN" : language === "hi" ? "hi-IN" : "en-IN";
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  }, [voiceEnabled, language]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const isCorrectLanguage = (text: string, lang: string) => {
    if (lang === "hi") return (/[\u0900-\u097F]/).test(text);
    if (lang === "or") return (/[\u0B00-\u0B7F]/).test(text);
    return true; // For English, we assume true.
  };

  const handleSend = useCallback(async () => {
    if ((!input.trim() && !selectedImage) || isLoading) return;
    if (isListening) toggleListen(); // Stop mic if listening

    const currentInput = input;
    const currentImage = selectedImage;
    const currentPreview = imagePreview;

    const userMsg: Message = {
      id: Date.now().toString(),
      text: currentInput,
      sender: "user",
      timestamp: new Date(),
      imageUrl: currentPreview || undefined,
    };
    
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setSelectedImage(null);
    setImagePreview(null);
    setIsLoading(true);

    try {
      let aiText = "";

      if (currentImage) {
        const formData = new FormData();
        formData.append("image", currentImage);
        formData.append("prompt", currentInput || "Analyze this image and identify any diseases or crop conditions.");
        
        const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3001";
        const response = await fetch(`${backendUrl}/api/chat`, {
  method: "POST",
  body: formData,
});
        
        const data = await response.json();
        aiText = data.text;
      } else {
        const baseSystemPrompt = language === "hi" 
          ? "You are Krishi AI, an expert agriculture assistant helping farmers. Respond ONLY in Hindi (Devanagari script). Keep actionable." 
          : language === "or" 
          ? "You are Krishi AI, an expert agriculture assistant helping farmers. Respond ONLY in Odia language. Keep actionable."
          : "You are Krishi AI, an expert agriculture assistant helping farmers. Respond in English. Keep actionable.";

        const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3001";
        const response = await fetch(`${backendUrl}/api/chat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: currentInput, systemPrompt: baseSystemPrompt }),
        });
        
        if (response.status === 429) {
          throw new Error("Too many requests. Please wait a moment.");
        }
        if (!response.ok) throw new Error("Backend connection failed");
        
        const data = await response.json();
        aiText = data.text;

        // Fallback Safety Check
        if (!isCorrectLanguage(aiText, language)) {
          // Language mismatch detected, retrying with stricter prompt
          const stricterPrompt = language === "hi" ? "Respond strictly in Hindi only." : "Respond strictly in Odia language only.";
          const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3001";
          const retryResponse = await fetch(`${backendUrl}/api/chat`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: currentInput, systemPrompt: `${baseSystemPrompt} ${stricterPrompt}` }),
          });

          if (retryResponse.ok) {
            const retryData = await retryResponse.json();
            if (retryData.text) aiText = retryData.text;
          }
        }
      }

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          text: aiText,
          sender: "ai",
          timestamp: new Date(),
        },
      ]);
      speakText(aiText);
    } catch (error: unknown) {
      console.error("AI Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          text: "Server is waking up... please try again in 10 seconds.",
          sender: "ai",
          timestamp: new Date(),
          isError: true,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [input, selectedImage, imagePreview, isLoading, isListening, language, toggleListen, isCorrectLanguage, speakText]);

  const formatTime = (date: Date) => date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="flex flex-col h-[100dvh] bg-mesh font-body relative">
      {/* WhatsApp style exact Header */}
      <div className="bg-primary text-primary-foreground px-3 py-3 flex items-center justify-between sticky top-0 z-20 shadow-md">
        <div className="flex items-center gap-2">
          <button onClick={() => navigate(-1)} className="p-1.5 -ml-1 rounded-full hover:bg-white/10 transition">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="relative">
            <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center overflow-hidden border border-white/20 shadow-sm">
               <Bot className="w-6 h-6 text-primary" />
            </div>
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 border-2 border-primary rounded-full"></div>
          </div>
          <div className="ml-1 flex flex-col">
            <span className="font-semibold text-base leading-tight">Krishi AI</span>
            <span className="text-primary-foreground/80 text-[11px] leading-tight flex items-center gap-1">
              {isLoading ? "typing..." : "online"}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as "en" | "hi" | "or")}
            className="bg-primary-foreground/10 text-primary-foreground text-xs font-medium rounded px-1.5 py-1 outline-none appearance-none border border-white/20 cursor-pointer text-center mr-1"
          >
            <option value="en" className="text-black">EN</option>
            <option value="hi" className="text-black">HI</option>
            <option value="or" className="text-black">OR</option>
          </select>
          <button 
            onClick={() => setVoiceEnabled(!voiceEnabled)} 
            className="p-2 rounded-full hover:bg-white/10 transition"
          >
            {voiceEnabled ? <Volume2 className="w-5 h-5 text-primary-foreground" /> : <VolumeX className="w-5 h-5 text-primary-foreground opacity-70" />}
          </button>
          <button className="p-2 rounded-full hover:bg-white/10 transition hidden sm:flex">
            <MoreVertical className="w-5 h-5 text-primary-foreground" />
          </button>
        </div>
      </div>

      {/* WhatsApp chat background pattern */}
      <div 
        className="absolute inset-0 z-0 opacity-[0.06] pointer-events-none" 
        style={{ backgroundImage: 'url("https://i.pinimg.com/736x/8c/98/99/8c98994518b575bfd8c949e91d20548b.jpg")', backgroundSize: '400px' }}
      ></div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 z-10 custom-scrollbar pb-32">
        <AnimatePresence>
          {messages.map((msg) => {
            const isUser = msg.sender === "user";
            return (
              <motion.div
                initial={{ opacity: 0, y: 15, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                key={msg.id}
                className={`flex flex-col ${isUser ? "items-end" : "items-start"} mb-4`}
              >
                <div 
                  className={`relative max-w-[85%] sm:max-w-[75%] rounded-[15px] px-3 py-2 shadow-card 
                    ${isUser ? "bg-primary/20 text-foreground rounded-tr-sm border border-primary/20" : "bg-card text-foreground rounded-tl-sm border border-border/50"}
                    ${msg.isError ? "border border-red-300 bg-red-50" : ""}
                  `}
                >
                  {/* Decorative tail */}
                  <div className={`absolute top-0 w-4 h-4 
                    ${isUser ? "-right-[9px] text-primary/20" : "-left-[9px] text-card"}`}
                  >
                    <svg viewBox="0 0 8 13" width="8" height="13" className={isUser ? "fill-primary/20" : "fill-card"}>
                      {isUser 
                        ? <path d="M5.188 1H0v11.193l6.467-8.625C7.526 2.156 6.958 1 5.188 1z"/> 
                        : <path d="M1.533 3.568L8 12.193V1H2.812C1.042 1 .474 2.156 1.533 3.568z"/>}
                    </svg>
                  </div>

                  {/* Image Payload */}
                  {msg.imageUrl && (
                    <div className="mb-2 w-full rounded-lg overflow-hidden border border-black/5 bg-black/5">
                      <img src={msg.imageUrl} alt="Uploaded" className="w-full h-auto max-h-[300px] object-cover" />
                    </div>
                  )}

                  {/* Text Payload */}
                  {msg.text && (
                    <div className="pr-12 text-[15px]">
                      {isUser ? (
                        <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                      ) : (
                        <FormattedMessage text={msg.text} />
                      )}
                    </div>
                  )}

                  {/* Timestamp & Read Receipt */}
                  <div className="absolute bottom-1.5 right-2 flex items-center gap-1">
                    <span className="text-[10px] text-black/45 leading-none">{formatTime(msg.timestamp)}</span>
                    {isUser && <CheckCheck className="w-3.5 h-3.5 text-[#53bdeb] ml-0.5" />}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        
        {/* Typing indicator */}
        {isLoading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-start mb-4">
             <div className="relative max-w-[85%] bg-white rounded-[15px] rounded-tl-sm px-4 py-3 shadow-sm">
                <div className="absolute top-0 -left-[9px] w-4 h-4 text-white">
                    <svg viewBox="0 0 8 13" width="8" height="13" className="fill-white">
                      <path d="M1.533 3.568L8 12.193V1H2.812C1.042 1 .474 2.156 1.533 3.568z"/>
                    </svg>
                </div>
                <div className="flex items-center gap-1.5 h-4">
                  <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} className="w-1.5 h-1.5 rounded-full bg-slate-400"></motion.div>
                  <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-1.5 h-1.5 rounded-full bg-slate-400"></motion.div>
                  <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-1.5 h-1.5 rounded-full bg-slate-400"></motion.div>
                </div>
             </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="fixed bottom-0 left-0 right-0 p-2 sm:p-3 bg-transparent z-20">
        
        {/* Image Preview popup before sending */}
        <AnimatePresence>
          {imagePreview && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute bottom-full left-4 mb-2 bg-white p-2 rounded-2xl shadow-xl border border-border w-28 h-28 z-30"
            >
              <img src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded-xl" />
              <button 
                onClick={removeImage}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center shadow-md hover:bg-red-600 transition"
              >
                <X className="w-3 h-3" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="max-w-3xl mx-auto flex items-end gap-2">
          
          <div className="flex-1 bg-card rounded-3xl flex items-end shadow-card border border-amber-900/10 overflow-hidden ring-1 ring-inset ring-white/20 focus-within:ring-primary/50">
            {/* Attachment Button */}
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="p-3.5 text-slate-500 hover:text-slate-700 transition shrink-0"
            >
              <ImageIcon className="w-6 h-6" />
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageSelect} 
                className="hidden" 
                accept="image/*" 
              />
            </button>

            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder={isListening ? "Listening..." : "Message Krishi AI..."}
              className={`w-full bg-transparent py-3.5 px-1 outline-none resize-none max-h-32 text-base ${isListening ? 'text-primary font-medium' : 'text-foreground'}`}
              rows={1}
              style={{ minHeight: '52px' }}
            />

            {/* Mic Toggle if no input */}
            {(!input.trim() && !imagePreview) ? (
              <button 
                onClick={toggleListen}
                className={`p-3.5 shrink-0 transition-colors ${isListening ? 'text-red-500 animate-pulse' : 'text-slate-500 hover:text-slate-700'}`}
              >
                {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
              </button>
            ) : null}
          </div>

          {/* Send Button */}
          <button
            onClick={handleSend}
            disabled={(!input.trim() && !imagePreview) || isLoading}
            className="w-[52px] h-[52px] rounded-full bg-primary flex flex-col items-center justify-center shrink-0 shadow-lg hover:shadow-primary/20 disabled:opacity-50 transition-all font-display font-bold"
          >
            <Send className="w-5 h-5 text-primary-foreground ml-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AiChat;

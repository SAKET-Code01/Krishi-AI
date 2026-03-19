import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Index from "./pages/Index.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import CropDoctor from "./pages/CropDoctor.tsx";
import VoiceAssistant from "./pages/VoiceAssistant.tsx";
import MarketPrices from "./pages/MarketPrices.tsx";
import FarmJobs from "./pages/FarmJobs.tsx";
import Weather from "./pages/Weather.tsx";
import GovtSchemes from "./pages/GovtSchemes.tsx";
import LandFinder from "./pages/LandFinder.tsx";
import Profile from "./pages/Profile.tsx";
import Reports from "./pages/Reports.tsx";
import Login from "./pages/Login.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/crop-doctor" element={<CropDoctor />} />
            <Route path="/voice-assistant" element={<VoiceAssistant />} />
            <Route path="/market" element={<MarketPrices />} />
            <Route path="/jobs" element={<FarmJobs />} />
            <Route path="/weather" element={<Weather />} />
            <Route path="/schemes" element={<GovtSchemes />} />
            <Route path="/land" element={<LandFinder />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;

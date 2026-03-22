import { motion } from "framer-motion";
import { MapPin, ArrowLeft, Ruler, Phone, TreePine } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

const LandFinder = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const lands = [
    { id: 1, location: "Khurda, Odisha", size: "2.5 acres", distance: "8 km", type: "Paddy Land", authority: "Revenue Dept, Khurda", contact: "+91 98765 43210" },
    { id: 2, location: "Jatni, Odisha", size: "5 acres", distance: "15 km", type: "Mixed Crop", authority: "Block Office, Jatni", contact: "+91 87654 32109" },
    { id: 3, location: "Nayagarh, Odisha", size: "3.2 acres", distance: "32 km", type: "Horticulture", authority: "Revenue Dept, Nayagarh", contact: "+91 76543 21098" },
    { id: 4, location: "Puri, Odisha", size: "1.8 acres", distance: "45 km", type: "Vegetable Farm", authority: "Panchayat Office, Puri", contact: "+91 65432 10987" },
  ];

  return (
    <div className="min-h-screen bg-mesh pb-28">
      <div className="glass-card border-b border-white/30 px-4 py-4">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 rounded-xl hover:bg-muted">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <div>
            <h1 className="text-xl font-display font-bold text-foreground flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              {t("land.title")}
            </h1>
            <p className="text-xs font-body text-muted-foreground">{t("land.subtitle")}</p>
          </div>
        </div>
      </div>

      <div className="mx-4 mt-4 rounded-2xl bg-secondary/10 border-2 border-secondary/20 h-48 flex items-center justify-center">
        <div className="text-center">
          <MapPin className="w-10 h-10 text-secondary mx-auto mb-2" />
          <p className="font-display font-semibold text-foreground">{t("land.mapView")}</p>
          <p className="text-xs font-body text-muted-foreground px-4">{t("land.mapDesc")}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-4 space-y-3">
        <h2 className="font-display font-bold text-foreground">{t("land.available")}</h2>
        {lands.map((land, i) => (
          <motion.div
            key={land.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="glass-card border border-white/30 rounded-2xl p-4 card-hover-glow shadow-card"
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="font-display font-bold text-foreground">{land.location}</h3>
                <span className="text-xs font-display font-semibold px-2 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20">
                  {land.type}
                </span>
              </div>
              <p className="text-sm font-body text-muted-foreground">{land.distance} {t("land.away")}</p>
            </div>
            <div className="mt-2 space-y-1 text-sm font-body text-muted-foreground">
              <p className="flex items-center gap-1.5"><Ruler className="w-3.5 h-3.5" />{land.size}</p>
              <p className="flex items-center gap-1.5"><TreePine className="w-3.5 h-3.5" />{land.authority}</p>
              <p className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" />{land.contact}</p>
            </div>
            <motion.button
              whileTap={{ scale: 0.97 }}
              className="mt-3 w-full py-2.5 rounded-xl bg-primary text-primary-foreground font-display font-semibold text-sm"
            >
              {t("land.apply")}
            </motion.button>
          </motion.div>
        ))}
      </div>

      <BottomNav />
    </div>
  );
};

export default LandFinder;

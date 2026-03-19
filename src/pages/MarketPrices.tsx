import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, ArrowLeft, Search } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

const MarketPrices = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [search, setSearch] = useState("");

  const marketData = [
    { crop: t("crop.rice"), market: "Cuttack Mandi", price: 2150, change: 3.2, trend: "up" },
    { crop: t("crop.wheat"), market: "Sambalpur Mandi", price: 2340, change: -1.5, trend: "down" },
    { crop: t("crop.mustard"), market: "Balasore Mandi", price: 5200, change: 5.1, trend: "up" },
    { crop: t("crop.onion"), market: "Bhubaneswar Mandi", price: 1800, change: -8.3, trend: "down" },
    { crop: t("crop.tomato"), market: "Puri Mandi", price: 2600, change: 12.0, trend: "up" },
    { crop: t("crop.potato"), market: "Cuttack Mandi", price: 1200, change: 0.5, trend: "up" },
    { crop: t("crop.greenGram"), market: "Berhampur Mandi", price: 7100, change: 2.8, trend: "up" },
    { crop: t("crop.sugarcane"), market: "Balasore Mandi", price: 350, change: -0.3, trend: "down" },
  ];

  const filtered = marketData.filter(
    (entry) =>
      entry.crop.toLowerCase().includes(search.toLowerCase()) ||
      entry.market.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-background pb-28">
      <div className="bg-card border-b-2 border-border px-4 py-4">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => navigate(-1)} className="p-2 rounded-xl hover:bg-muted">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <div>
            <h1 className="text-xl font-display font-bold text-foreground flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              {t("market.title")}
            </h1>
            <p className="text-xs font-body text-muted-foreground">{t("market.subtitle")}</p>
          </div>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("market.search")}
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-muted border-2 border-border text-sm font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
      </div>

      <div className="container mx-auto px-4 py-4 space-y-3">
        {filtered.map((item, i) => (
          <motion.div
            key={item.crop + item.market}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-card border-2 border-border rounded-xl p-4 flex items-center justify-between"
          >
            <div>
              <p className="font-display font-bold text-foreground">{item.crop}</p>
              <p className="text-xs font-body text-muted-foreground">{item.market}</p>
            </div>
            <div className="text-right">
              <p className="font-display font-bold text-lg text-foreground">₹{item.price.toLocaleString()}</p>
              <div
                className={`flex items-center gap-1 text-sm font-display font-semibold ${
                  item.trend === "up" ? "text-primary" : "text-destructive"
                }`}
              >
                {item.trend === "up" ? (
                  <TrendingUp className="w-3.5 h-3.5" />
                ) : (
                  <TrendingDown className="w-3.5 h-3.5" />
                )}
                {item.change > 0 ? "+" : ""}
                {item.change}%
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <BottomNav />
    </div>
  );
};

export default MarketPrices;
